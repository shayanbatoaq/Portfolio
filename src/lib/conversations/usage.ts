import "server-only";

import type { TokenUsage } from "@/types/conversations";

interface OpenRouterUsageLike {
  prompt_tokens?: unknown;
  completion_tokens?: unknown;
  total_tokens?: unknown;
  cost?: unknown;
}

function nonNegativeInteger(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : 0;
}

export function normalizeOpenRouterUsage(value: unknown): TokenUsage {
  const usage =
    value && typeof value === "object" ? (value as OpenRouterUsageLike) : {};
  const inputTokens = nonNegativeInteger(usage.prompt_tokens);
  const outputTokens = nonNegativeInteger(usage.completion_tokens);
  const reportedTotal = nonNegativeInteger(usage.total_tokens);
  const costUsd =
    typeof usage.cost === "number" && Number.isFinite(usage.cost) && usage.cost >= 0
      ? usage.cost
      : null;

  return {
    inputTokens,
    outputTokens,
    totalTokens: reportedTotal || inputTokens + outputTokens,
    costUsd,
  };
}
