import "server-only";

const DEFAULT_MODEL = "openai/gpt-5.4-mini";

export const chatConfig = {
  model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  siteName:
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Shayan Batoaq Portfolio",
  temperature: 0.65,
  topP: 0.9,
  maxTokens: 600,
  requestTimeoutMs: 15_000,
  maxRequestBodyBytes: 300_000,
  maxMessageCharacters: 2_000,
  maxHistoryMessages: 12,
  rateLimitWindowMs: 60_000,
  rateLimitMaxRequests: 10,
} as const;
