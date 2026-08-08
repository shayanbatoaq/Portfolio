import "server-only";

import {
  Client,
  type BlockObjectRequest,
  type CreatePageParameters,
} from "@notionhq/client";

import { withNotionRetry } from "@/lib/conversations/retry";
import { notionPropertyText, paragraph } from "@/lib/conversations/transcript";
import type {
  ConversationAnalysis,
  UsageTotals,
} from "@/types/conversations";

type PageProperties = NonNullable<CreatePageParameters["properties"]>;
type PropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "status"
  | "date"
  | "checkbox"
  | string;

interface DataSourceContext {
  id: string;
  properties: Record<string, PropertyType>;
}

export interface ConversationPageSnapshot {
  pageId: string;
  blocks: unknown[];
}

export interface ConversationPageRecord {
  sessionId: string;
  startedAt: string;
  analysis: ConversationAnalysis;
  usage: UsageTotals;
}

let clientSingleton: Client | null = null;
let contextPromise: Promise<DataSourceContext> | null = null;

function getClient(): Client {
  if (clientSingleton) return clientSingleton;
  const auth = process.env.NOTION_TOKEN?.trim();
  if (!auth) throw new Error("NOTION_TOKEN is not configured");
  clientSingleton = new Client({
    auth,
    notionVersion: "2026-03-11",
    retry: false,
    timeoutMs: 12_000,
  });
  return clientSingleton;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function extractProperties(value: unknown): Record<string, PropertyType> {
  const record = asRecord(value);
  const rawProperties = asRecord(record?.properties);
  if (!rawProperties) throw new Error("Notion data source schema is unavailable");

  const properties: Record<string, PropertyType> = {};
  for (const [name, property] of Object.entries(rawProperties)) {
    const type = asRecord(property)?.type;
    if (typeof type === "string") properties[name] = type;
  }
  return properties;
}

async function resolveContext(): Promise<DataSourceContext> {
  if (contextPromise) return contextPromise;
  contextPromise = (async () => {
    const configuredId = process.env.NOTION_PORTFOLIO_DATABASE_ID?.trim();
    if (!configuredId) {
      throw new Error("NOTION_PORTFOLIO_DATABASE_ID is not configured");
    }

    const notion = getClient();
    try {
      const dataSource = await withNotionRetry(() =>
        notion.dataSources.retrieve({ data_source_id: configuredId }),
      );
      return {
        id: configuredId,
        properties: extractProperties(dataSource),
      };
    } catch (dataSourceError) {
      try {
        const database = await withNotionRetry(() =>
          notion.databases.retrieve({ database_id: configuredId }),
        );
        const dataSources = asRecord(database)?.data_sources;
        const first = Array.isArray(dataSources) ? asRecord(dataSources[0]) : null;
        const dataSourceId = first?.id;
        if (typeof dataSourceId !== "string") throw dataSourceError;
        const dataSource = await withNotionRetry(() =>
          notion.dataSources.retrieve({ data_source_id: dataSourceId }),
        );
        return {
          id: dataSourceId,
          properties: extractProperties(dataSource),
        };
      } catch {
        throw dataSourceError;
      }
    }
  })();
  return contextPromise;
}

function text(content: string) {
  return [{ type: "text" as const, text: { content: notionPropertyText(content) } }];
}

function setString(
  output: PageProperties,
  schema: Record<string, PropertyType>,
  name: string,
  value: string,
): void {
  const type = schema[name];
  if (type === "title") output[name] = { title: text(value) };
  if (type === "rich_text") output[name] = { rich_text: text(value) };
  if (type === "select") output[name] = { select: value ? { name: value } : null };
  if (type === "status") output[name] = { status: value ? { name: value } : null };
}

function setArray(
  output: PageProperties,
  schema: Record<string, PropertyType>,
  name: string,
  values: string[],
): void {
  const type = schema[name];
  if (type === "multi_select") {
    output[name] = { multi_select: values.map((nameValue) => ({ name: nameValue })) };
  }
  if (type === "rich_text") output[name] = { rich_text: text(values.join("\n")) };
}

function setNumber(
  output: PageProperties,
  schema: Record<string, PropertyType>,
  name: string,
  value: number | null,
): void {
  if (schema[name] === "number") output[name] = { number: value };
}

function setBoolean(
  output: PageProperties,
  schema: Record<string, PropertyType>,
  name: string,
  value: boolean,
): void {
  if (schema[name] === "checkbox") output[name] = { checkbox: value };
}

function buildProperties(
  schema: Record<string, PropertyType>,
  record: ConversationPageRecord,
): PageProperties {
  const output: PageProperties = {};
  const { analysis, usage } = record;
  setString(output, schema, "Conversation", `Portfolio conversation ${record.sessionId}`);
  if (schema.Created === "date") output.Created = { date: { start: record.startedAt } };
  setString(output, schema, "Session ID", record.sessionId);
  setString(output, schema, "Visitor Intent", analysis.visitorIntent);
  setArray(output, schema, "Opportunity Type", analysis.opportunityTypes);
  setNumber(output, schema, "Opportunity Score", analysis.opportunityScore);
  setBoolean(output, schema, "Qualified Opportunity", analysis.qualifiedOpportunity);
  setBoolean(output, schema, "Contact Recommended", analysis.contactRecommended);
  setArray(output, schema, "Interest Areas", analysis.interestAreas);
  setString(output, schema, "Summary", analysis.summary);
  setString(output, schema, "Outcome", analysis.outcome);
  setArray(output, schema, "Knowledge Gaps", analysis.knowledgeGaps);
  setArray(output, schema, "Improvements", analysis.improvements);
  setArray(output, schema, "Tags", analysis.tags);
  setString(output, schema, "Model", usage.model);
  setNumber(output, schema, "Input Tokens", usage.inputTokens);
  setNumber(output, schema, "Output Tokens", usage.outputTokens);
  setNumber(output, schema, "Total Tokens", usage.totalTokens);
  setNumber(output, schema, "Estimated Cost USD", usage.costUsd);
  setNumber(output, schema, "Duration Seconds", usage.durationSeconds);
  setNumber(output, schema, "User Messages", usage.userMessages);
  setNumber(output, schema, "Assistant Messages", usage.assistantMessages);
  return output;
}

async function findConversationPageId(sessionId: string): Promise<string | null> {
  const notion = getClient();
  const context = await resolveContext();
  const sessionPropertyType = context.properties["Session ID"];
  let response;
  if (sessionPropertyType === "rich_text") {
    response = await withNotionRetry(() =>
      notion.dataSources.query({
        data_source_id: context.id,
        page_size: 2,
        filter: { property: "Session ID", rich_text: { equals: sessionId } },
      }),
    );
  } else if (sessionPropertyType === "title") {
    response = await withNotionRetry(() =>
      notion.dataSources.query({
        data_source_id: context.id,
        page_size: 2,
        filter: { property: "Session ID", title: { equals: sessionId } },
      }),
    );
  } else {
    throw new Error('Notion property "Session ID" must be rich text or title');
  }

  const first = response.results[0];
  return first && "id" in first ? first.id : null;
}

async function listAllBlocks(pageId: string): Promise<unknown[]> {
  const notion = getClient();
  const blocks: unknown[] = [];
  let cursor: string | undefined;
  do {
    const response = await withNotionRetry(() =>
      notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
    );
    blocks.push(...response.results);
    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

export async function findConversationPage(
  sessionId: string,
): Promise<ConversationPageSnapshot | null> {
  const pageId = await findConversationPageId(sessionId);
  if (!pageId) return null;
  return { pageId, blocks: await listAllBlocks(pageId) };
}

export async function createConversationPage(
  record: ConversationPageRecord,
  children: BlockObjectRequest[],
): Promise<ConversationPageSnapshot> {
  const notion = getClient();
  const context = await resolveContext();
  const pageId = await withNotionRetry(
    () =>
      notion.pages.create({
        parent: { type: "data_source_id", data_source_id: context.id },
        properties: buildProperties(context.properties, record),
        children,
      }).then((page) => page.id),
    async () => {
      const existing = await findConversationPage(record.sessionId);
      return existing?.pageId ?? null;
    },
  );
  return { pageId, blocks: await listAllBlocks(pageId) };
}

export async function appendConversationBlocks(
  pageId: string,
  afterBlockId: string,
  children: BlockObjectRequest[],
  isAlreadyAppended: () => Promise<boolean>,
): Promise<void> {
  const notion = getClient();
  await withNotionRetry(
    () =>
      notion.blocks.children.append({
        block_id: pageId,
        children,
        position: { type: "after_block", after_block: { id: afterBlockId } },
      }).then(() => true),
    async () => ((await isAlreadyAppended()) ? true : null),
  );
}

export async function updateConversationProperties(
  pageId: string,
  record: ConversationPageRecord,
): Promise<void> {
  const notion = getClient();
  const context = await resolveContext();
  await withNotionRetry(() =>
    notion.pages.update({
      page_id: pageId,
      properties: buildProperties(context.properties, record),
    }),
  );
}

export async function updateParagraphBlock(
  blockId: string,
  content: string,
): Promise<void> {
  const notion = getClient();
  const block = paragraph(content);
  if (!("paragraph" in block)) throw new Error("Invalid paragraph block");
  await withNotionRetry(() =>
    notion.blocks.update({ block_id: blockId, paragraph: block.paragraph }),
  );
}
