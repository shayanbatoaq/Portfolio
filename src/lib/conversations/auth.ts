import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";

import type { ConversationLogEvent } from "@/types/conversations";

function signingSecret(): Buffer {
  const source = process.env.OPENROUTER_API_KEY?.trim();
  if (!source) throw new Error("Conversation signing is not configured");
  return createHash("sha256").update(source).digest();
}

function signature(value: string): string {
  return createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function canonicalEvent(event: ConversationLogEvent): string {
  return JSON.stringify([
    event.sessionId,
    event.exchangeId,
    event.startedAt,
    event.completedAt,
    event.model,
    event.usage.inputTokens,
    event.usage.outputTokens,
    event.usage.totalTokens,
    event.usage.costUsd,
    event.conversation.map((message) => [message.role, message.content]),
  ]);
}

export function signConversationEvent(event: ConversationLogEvent): string {
  return signature(`event:${canonicalEvent(event)}`);
}

export function verifyConversationEvent(
  event: ConversationLogEvent,
  token: string,
): boolean {
  return safeEqual(signConversationEvent(event), token);
}
