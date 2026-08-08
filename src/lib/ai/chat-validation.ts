import "server-only";

import { z } from "zod";

import { chatConfig } from "@/lib/ai/chat-config";

const messageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(chatConfig.maxMessageCharacters),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z.string().trim().min(1).max(12_000),
  }),
]);

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(80),
  sessionId: z.string().uuid(),
  exchangeId: z.string().uuid(),
  startedAt: z.string().datetime({ offset: true }),
});

export type ChatMessage = z.infer<typeof messageSchema>;

export interface ParsedChatRequest {
  conversation: ChatMessage[];
  promptMessages: ChatMessage[];
  sessionId: string;
  exchangeId: string;
  startedAt: string;
}

export function parseChatRequest(value: unknown): ParsedChatRequest {
  const parsed = requestSchema.parse(value);
  return {
    ...parsed,
    conversation: parsed.messages,
    promptMessages: parsed.messages.slice(-chatConfig.maxHistoryMessages),
  };
}
