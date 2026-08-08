import "server-only";

import { analyzeConversation } from "@/lib/conversations/analysis";
import { ensureUsageCost } from "@/lib/conversations/cost";
import {
  appendConversationBlocks,
  createConversationPage,
  findConversationPage,
  updateConversationProperties,
  updateParagraphBlock,
  type ConversationPageRecord,
  type ConversationPageSnapshot,
} from "@/lib/conversations/notion";
import {
  analysisText,
  heading1,
  overviewText,
  paragraph,
  parseUsageMarker,
  transcriptBlocks,
  usageText,
} from "@/lib/conversations/transcript";
import type {
  ConversationLogEvent,
  UsageTotals,
} from "@/types/conversations";

interface BlockDetails {
  id: string;
  type: string;
  text: string;
  links: string[];
}

const sessionQueues = new Map<string, Promise<void>>();

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function blockDetails(value: unknown): BlockDetails | null {
  const block = asRecord(value);
  const id = block?.id;
  const type = block?.type;
  if (!block || typeof id !== "string" || typeof type !== "string") return null;
  const content = asRecord(block[type]);
  const richText = Array.isArray(content?.rich_text) ? content.rich_text : [];
  const textParts: string[] = [];
  const links: string[] = [];
  for (const item of richText) {
    const richItem = asRecord(item);
    if (typeof richItem?.plain_text === "string") textParts.push(richItem.plain_text);
    if (typeof richItem?.href === "string") links.push(richItem.href);
  }
  return { id, type, text: textParts.join(""), links };
}

function detailsFor(snapshot: ConversationPageSnapshot): BlockDetails[] {
  return snapshot.blocks
    .map(blockDetails)
    .filter((block): block is BlockDetails => block !== null);
}

function usageMarkers(blocks: BlockDetails[]) {
  return blocks.flatMap((block) =>
    block.links
      .map(parseUsageMarker)
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null),
  );
}

function hasExchange(snapshot: ConversationPageSnapshot, exchangeId: string): boolean {
  return usageMarkers(detailsFor(snapshot)).some(
    (marker) => marker.exchangeId === exchangeId,
  );
}

function totalsFromSnapshot(
  snapshot: ConversationPageSnapshot,
  event: ConversationLogEvent,
): UsageTotals {
  const markers = usageMarkers(detailsFor(snapshot));
  const unique = new Map(markers.map((marker) => [marker.exchangeId, marker]));
  if (!unique.has(event.exchangeId)) {
    unique.set(event.exchangeId, {
      exchangeId: event.exchangeId,
      model: event.model,
      completedAt: event.completedAt,
      ...event.usage,
    });
  }
  const values = [...unique.values()];
  const costs = values.map((marker) => marker.costUsd);
  const completedTimes = values
    .map((marker) => Date.parse(marker.completedAt))
    .filter(Number.isFinite);
  const latestCompletion = completedTimes.length
    ? Math.max(...completedTimes)
    : Date.parse(event.completedAt);
  const started = Date.parse(event.startedAt);

  return {
    model: event.model,
    inputTokens: values.reduce((sum, marker) => sum + marker.inputTokens, 0),
    outputTokens: values.reduce((sum, marker) => sum + marker.outputTokens, 0),
    totalTokens: values.reduce((sum, marker) => sum + marker.totalTokens, 0),
    costUsd: costs.every((cost): cost is number => cost !== null)
      ? costs.reduce((sum, cost) => sum + cost, 0)
      : null,
    durationSeconds:
      Number.isFinite(started) && Number.isFinite(latestCompletion)
        ? Math.max(0, Math.ceil((latestCompletion - started) / 1_000))
        : 0,
    userMessages: values.length,
    assistantMessages: values.length,
  };
}

function sectionParagraphId(
  blocks: BlockDetails[],
  headingText: string,
): string | null {
  const headingIndex = blocks.findIndex(
    (block) => block.type === "heading_1" && block.text === headingText,
  );
  const next = headingIndex >= 0 ? blocks[headingIndex + 1] : undefined;
  return next?.type === "paragraph" ? next.id : null;
}

function transcriptInsertionBlockId(blocks: BlockDetails[]): string {
  const analysisIndex = blocks.findIndex(
    (block) => block.type === "heading_1" && block.text === "AI Analysis",
  );
  if (analysisIndex <= 0) throw new Error("Notion conversation page structure is invalid");
  return blocks[analysisIndex - 1].id;
}

async function synchronizeConversation(eventInput: ConversationLogEvent): Promise<void> {
  const event: ConversationLogEvent = {
    ...eventInput,
    usage: await ensureUsageCost(eventInput.usage, eventInput.model),
  };
  const analysis = await analyzeConversation(event.conversation);
  let snapshot = await findConversationPage(event.sessionId);

  if (!snapshot) {
    const usage: UsageTotals = {
      ...event.usage,
      model: event.model,
      durationSeconds: Math.max(
        0,
        Math.ceil((Date.parse(event.completedAt) - Date.parse(event.startedAt)) / 1_000),
      ),
      userMessages: 1,
      assistantMessages: 1,
    };
    const record: ConversationPageRecord = {
      sessionId: event.sessionId,
      startedAt: event.startedAt,
      analysis,
      usage,
    };
    snapshot = await createConversationPage(record, [
      heading1("Conversation Overview"),
      paragraph(overviewText(event.sessionId, event.startedAt, analysis)),
      heading1("Full Conversation"),
      ...transcriptBlocks(event),
      heading1("AI Analysis"),
      paragraph(analysisText(analysis)),
      heading1("Usage"),
      paragraph(usageText(usage)),
    ]);
  }

  if (!hasExchange(snapshot, event.exchangeId)) {
    const blocks = detailsFor(snapshot);
    await appendConversationBlocks(
      snapshot.pageId,
      transcriptInsertionBlockId(blocks),
      transcriptBlocks(event),
      async () => {
        const refreshed = await findConversationPage(event.sessionId);
        return refreshed ? hasExchange(refreshed, event.exchangeId) : false;
      },
    );
    const refreshed = await findConversationPage(event.sessionId);
    if (!refreshed) throw new Error("Notion conversation page disappeared");
    snapshot = refreshed;
  }

  const usage = totalsFromSnapshot(snapshot, event);
  const record: ConversationPageRecord = {
    sessionId: event.sessionId,
    startedAt: event.startedAt,
    analysis,
    usage,
  };
  await updateConversationProperties(snapshot.pageId, record);

  const blocks = detailsFor(snapshot);
  const overviewId = sectionParagraphId(blocks, "Conversation Overview");
  const analysisId = sectionParagraphId(blocks, "AI Analysis");
  const usageId = sectionParagraphId(blocks, "Usage");
  if (!overviewId || !analysisId || !usageId) {
    throw new Error("Notion conversation page sections are missing");
  }
  await Promise.all([
    updateParagraphBlock(
      overviewId,
      overviewText(event.sessionId, event.startedAt, analysis),
    ),
    updateParagraphBlock(analysisId, analysisText(analysis)),
    updateParagraphBlock(usageId, usageText(usage)),
  ]);
}

export async function logConversationEvent(event: ConversationLogEvent): Promise<void> {
  const previous = sessionQueues.get(event.sessionId) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(() => synchronizeConversation(event));
  sessionQueues.set(event.sessionId, current);
  try {
    await current;
  } finally {
    if (sessionQueues.get(event.sessionId) === current) {
      sessionQueues.delete(event.sessionId);
    }
  }
}
