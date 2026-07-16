import "server-only";

import { z } from "zod";

import { chatConfig } from "@/lib/ai/chat-config";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(chatConfig.maxMessageCharacters),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(24),
});

export type ChatMessage = z.infer<typeof messageSchema>;

export function parseChatRequest(value: unknown): ChatMessage[] {
  const { messages } = requestSchema.parse(value);
  return messages.slice(-chatConfig.maxHistoryMessages);
}
