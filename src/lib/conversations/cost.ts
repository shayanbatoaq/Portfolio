import "server-only";

import type { TokenUsage } from "@/types/conversations";

interface ModelPricing {
  prompt: number;
  completion: number;
}

const pricingCache = new Map<string, ModelPricing>();

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function parsePrice(value: unknown): number | null {
  const price = typeof value === "string" ? Number(value) : value;
  return typeof price === "number" && Number.isFinite(price) && price >= 0
    ? price
    : null;
}

async function fetchModelPricing(model: string): Promise<ModelPricing | null> {
  const cached = pricingCache.get(model);
  if (cached) return cached;

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;

  const encodedModel = model
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(
      `https://openrouter.ai/api/v1/models/${encodedModel}/endpoints`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        cache: "no-store",
      },
    );
    if (!response.ok) return null;

    const payload = asRecord(await response.json());
    const data = asRecord(payload?.data);
    const endpoints = Array.isArray(data?.endpoints) ? data.endpoints : [];
    for (const endpoint of endpoints) {
      const pricing = asRecord(asRecord(endpoint)?.pricing);
      const prompt = parsePrice(pricing?.prompt);
      const completion = parsePrice(pricing?.completion);
      if (prompt !== null && completion !== null) {
        const result = { prompt, completion };
        pricingCache.set(model, result);
        return result;
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureUsageCost(
  usage: TokenUsage,
  model: string,
): Promise<TokenUsage> {
  if (usage.costUsd !== null) return usage;
  if (usage.inputTokens === 0 && usage.outputTokens === 0) return usage;
  const pricing = await fetchModelPricing(model);
  if (!pricing) return usage;

  return {
    ...usage,
    costUsd:
      usage.inputTokens * pricing.prompt +
      usage.outputTokens * pricing.completion,
  };
}
