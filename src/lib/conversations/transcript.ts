import type { BlockObjectRequest } from "@notionhq/client";

import { chatConfig } from "@/lib/ai/chat-config";
import { sanitizeStoredText, truncateText } from "@/lib/conversations/sanitize";
import type {
  ConversationAnalysis,
  ConversationLogEvent,
  TokenUsage,
  UsageTotals,
} from "@/types/conversations";

interface UsageMarker extends TokenUsage {
  exchangeId: string;
  model: string;
  completedAt: string;
}

function richText(content: string, linkUrl?: string) {
  const sanitized = sanitizeStoredText(content);
  const chunks: Array<{
    type: "text";
    text: { content: string; link?: { url: string } | null };
  }> = [];
  for (let offset = 0; offset < sanitized.length; offset += 1_900) {
    chunks.push({
      type: "text",
      text: {
        content: sanitized.slice(offset, offset + 1_900),
        ...(linkUrl ? { link: { url: linkUrl } } : {}),
      },
    });
  }
  return chunks.length ? chunks : [{ type: "text" as const, text: { content: "" } }];
}

export function heading1(content: string): BlockObjectRequest {
  return { object: "block", type: "heading_1", heading_1: { rich_text: richText(content) } };
}

export function heading2(content: string, linkUrl?: string): BlockObjectRequest {
  return {
    object: "block",
    type: "heading_2",
    heading_2: { rich_text: richText(content, linkUrl) },
  };
}

export function paragraph(content: string): BlockObjectRequest {
  return { object: "block", type: "paragraph", paragraph: { rich_text: richText(content) } };
}

export function buildUsageMarker(event: ConversationLogEvent): string {
  const url = new URL("/__portfolio-conversation-event", chatConfig.siteUrl);
  url.searchParams.set("exchange", event.exchangeId);
  url.searchParams.set("model", event.model);
  url.searchParams.set("input", String(event.usage.inputTokens));
  url.searchParams.set("output", String(event.usage.outputTokens));
  url.searchParams.set("total", String(event.usage.totalTokens));
  url.searchParams.set("cost", event.usage.costUsd === null ? "" : String(event.usage.costUsd));
  url.searchParams.set("completed", event.completedAt);
  return url.toString();
}

function finiteNumber(value: string | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function parseUsageMarker(value: string): UsageMarker | null {
  try {
    const url = new URL(value);
    if (url.pathname !== "/__portfolio-conversation-event") return null;
    const exchangeId = url.searchParams.get("exchange");
    const model = url.searchParams.get("model");
    const completedAt = url.searchParams.get("completed");
    const inputTokens = finiteNumber(url.searchParams.get("input"));
    const outputTokens = finiteNumber(url.searchParams.get("output"));
    const totalTokens = finiteNumber(url.searchParams.get("total"));
    const costUsd = finiteNumber(url.searchParams.get("cost"));
    if (!exchangeId || !model || !completedAt || inputTokens === null || outputTokens === null || totalTokens === null) {
      return null;
    }
    return { exchangeId, model, completedAt, inputTokens, outputTokens, totalTokens, costUsd };
  } catch {
    return null;
  }
}

export function transcriptBlocks(event: ConversationLogEvent): BlockObjectRequest[] {
  const latestUser = [...event.conversation].reverse().find((message) => message.role === "user");
  const latestAssistant = [...event.conversation].reverse().find((message) => message.role === "assistant");
  if (!latestUser || !latestAssistant) throw new Error("A complete exchange is required");

  return [
    heading2("User"),
    paragraph(latestUser.content),
    heading2("Assistant", buildUsageMarker(event)),
    paragraph(latestAssistant.content),
  ];
}

export function overviewText(
  sessionId: string,
  startedAt: string,
  analysis: ConversationAnalysis,
): string {
  return [
    `Session ID: ${sessionId}`,
    `Created: ${startedAt}`,
    `Visitor Intent: ${analysis.visitorIntent}`,
    `Opportunity: ${analysis.opportunityTypes.join(", ") || "None"}`,
    `Summary: ${analysis.summary}`,
  ].join("\n");
}

export function analysisText(analysis: ConversationAnalysis): string {
  return [
    `Outcome: ${analysis.outcome}`,
    `Opportunity Score: ${analysis.opportunityScore}`,
    `Qualified Opportunity: ${analysis.qualifiedOpportunity ? "Yes" : "No"}`,
    `Contact Recommended: ${analysis.contactRecommended ? "Yes" : "No"}`,
    `Interest Areas: ${analysis.interestAreas.join(", ") || "None"}`,
    `Knowledge Gaps: ${analysis.knowledgeGaps.join("; ") || "None"}`,
    `Improvements: ${analysis.improvements.join("; ") || "None"}`,
    `Tags: ${analysis.tags.join(", ") || "None"}`,
  ].join("\n");
}

export function usageText(usage: UsageTotals): string {
  return [
    `Model: ${usage.model}`,
    `Input Tokens: ${usage.inputTokens}`,
    `Output Tokens: ${usage.outputTokens}`,
    `Total Tokens: ${usage.totalTokens}`,
    `Estimated Cost USD: ${usage.costUsd === null ? "Unavailable" : usage.costUsd.toFixed(8)}`,
    `Duration Seconds: ${usage.durationSeconds}`,
    `User Messages: ${usage.userMessages}`,
    `Assistant Messages: ${usage.assistantMessages}`,
  ].join("\n");
}

export function notionPropertyText(value: string): string {
  return truncateText(value, 1_900);
}
