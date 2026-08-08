import { z } from "zod";

const isoDateSchema = z.string().datetime({ offset: true });
const idSchema = z.string().uuid();

export const conversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(12_000),
});

export const tokenUsageSchema = z.object({
  inputTokens: z.number().int().min(0).max(100_000_000),
  outputTokens: z.number().int().min(0).max(100_000_000),
  totalTokens: z.number().int().min(0).max(200_000_000),
  costUsd: z.number().min(0).max(1_000_000).nullable(),
});

export const conversationLogEventSchema = z.object({
  sessionId: idSchema,
  exchangeId: idSchema,
  startedAt: isoDateSchema,
  completedAt: isoDateSchema,
  model: z.string().trim().min(1).max(200),
  usage: tokenUsageSchema,
  conversation: z.array(conversationMessageSchema).min(2).max(80),
});

export const conversationLogRequestSchema = conversationLogEventSchema.extend({
  token: z.string().min(32).max(200),
});
