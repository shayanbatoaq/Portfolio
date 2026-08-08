"use client";

import type {
  ConversationLogRequest,
  ConversationMessage,
  TokenUsage,
} from "@/types/conversations";

export interface SessionMessage {
  role: "user" | "ai";
  text: string;
}

export interface PreparedConversation {
  sessionId: string;
  exchangeId: string;
  startedAt: string;
  messages: SessionMessage[];
  requestMessages: ConversationMessage[];
}

export interface ChatLoggingMetadata {
  sessionId: string;
  exchangeId: string;
  startedAt: string;
  completedAt: string;
  model: string;
  usage: TokenUsage;
  token: string;
}

interface StoredSession {
  sessionId: string;
  startedAt: string;
  lastActivityAt: string;
  messages: SessionMessage[];
}

interface OutboxItem {
  id: string;
  attempts: number;
  nextAttemptAt: number;
  payload: ConversationLogRequest;
}

const SESSION_KEY = "portfolio-ai-conversation-v1";
const OUTBOX_KEY = "portfolio-ai-conversation-outbox-v1";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1_000;
const MAX_MESSAGES = 80;
const MAX_OUTBOX_ITEMS = 50;

let flushing = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isSessionMessage(value: unknown): value is SessionMessage {
  return (
    isRecord(value) &&
    (value.role === "user" || value.role === "ai") &&
    typeof value.text === "string"
  );
}

function readJson(key: string): unknown {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in restricted browser modes; chat still works.
  }
}

function readSession(): StoredSession | null {
  const value = readJson(SESSION_KEY);
  if (
    !isRecord(value) ||
    typeof value.sessionId !== "string" ||
    typeof value.startedAt !== "string" ||
    typeof value.lastActivityAt !== "string" ||
    !Array.isArray(value.messages) ||
    !value.messages.every(isSessionMessage)
  ) {
    return null;
  }
  return {
    sessionId: value.sessionId,
    startedAt: value.startedAt,
    lastActivityAt: value.lastActivityAt,
    messages: value.messages.slice(-MAX_MESSAGES),
  };
}

function activeSession(): StoredSession | null {
  const session = readSession();
  if (!session) return null;
  const lastActivity = Date.parse(session.lastActivityAt);
  if (!Number.isFinite(lastActivity) || Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS) {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // A fresh in-memory session will still be created below.
    }
    return null;
  }
  return session;
}

function newSession(): StoredSession {
  const now = new Date().toISOString();
  return {
    sessionId: crypto.randomUUID(),
    startedAt: now,
    lastActivityAt: now,
    messages: [],
  };
}

function toConversationMessages(messages: SessionMessage[]): ConversationMessage[] {
  return messages.map((message) => ({
    role: message.role === "ai" ? "assistant" : "user",
    content: message.text,
  }));
}

export function getPersistedConversationMessages(): SessionMessage[] {
  if (typeof window === "undefined") return [];
  return activeSession()?.messages ?? [];
}

export function prepareConversationMessage(text: string): PreparedConversation {
  const session = activeSession() ?? newSession();
  const messages = [
    ...session.messages,
    { role: "user" as const, text: text.trim() },
  ].slice(-MAX_MESSAGES);
  const updated: StoredSession = {
    ...session,
    lastActivityAt: new Date().toISOString(),
    messages,
  };
  writeJson(SESSION_KEY, updated);

  return {
    sessionId: updated.sessionId,
    exchangeId: crypto.randomUUID(),
    startedAt: updated.startedAt,
    messages,
    requestMessages: toConversationMessages(messages),
  };
}

function readOutbox(): OutboxItem[] {
  const value = readJson(OUTBOX_KEY);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is OutboxItem => {
    if (!isRecord(item) || !isRecord(item.payload)) return false;
    return (
      typeof item.id === "string" &&
      typeof item.attempts === "number" &&
      typeof item.nextAttemptAt === "number" &&
      typeof item.payload.sessionId === "string" &&
      typeof item.payload.exchangeId === "string" &&
      typeof item.payload.token === "string"
    );
  });
}

function scheduleOutboxFlush(delayMs: number): void {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void flushConversationOutbox();
  }, delayMs);
}

async function flushConversationOutbox(): Promise<void> {
  if (flushing || typeof window === "undefined") return;
  flushing = true;
  try {
    while (true) {
      const outbox = readOutbox();
      const item = outbox[0];
      if (!item) return;
      const waitMs = item.nextAttemptAt - Date.now();
      if (waitMs > 0) {
        scheduleOutboxFlush(Math.min(waitMs, 60_000));
        return;
      }

      try {
        const response = await fetch("/api/conversations/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload),
          keepalive: true,
        });
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          writeJson(
            OUTBOX_KEY,
            outbox.filter((entry) => entry.id !== item.id),
          );
          continue;
        }
      } catch {
        // Persisted below and retried without surfacing an error in the chatbot.
      }

      const attempts = item.attempts + 1;
      const delay = Math.min(1_000 * 2 ** Math.min(attempts, 6), 60_000);
      writeJson(OUTBOX_KEY, [
        { ...item, attempts, nextAttemptAt: Date.now() + delay },
        ...outbox.slice(1),
      ]);
      scheduleOutboxFlush(delay);
      return;
    }
  } finally {
    flushing = false;
  }
}

export function isChatLoggingMetadata(value: unknown): value is ChatLoggingMetadata {
  if (!isRecord(value) || !isRecord(value.usage)) return false;
  return (
    typeof value.sessionId === "string" &&
    typeof value.exchangeId === "string" &&
    typeof value.startedAt === "string" &&
    typeof value.completedAt === "string" &&
    typeof value.model === "string" &&
    typeof value.token === "string" &&
    typeof value.usage.inputTokens === "number" &&
    typeof value.usage.outputTokens === "number" &&
    typeof value.usage.totalTokens === "number" &&
    (typeof value.usage.costUsd === "number" || value.usage.costUsd === null)
  );
}

export function recordSuccessfulConversation(
  prepared: PreparedConversation,
  assistantMessage: string,
  logging: ChatLoggingMetadata,
): void {
  if (
    logging.sessionId !== prepared.sessionId ||
    logging.exchangeId !== prepared.exchangeId ||
    logging.startedAt !== prepared.startedAt
  ) {
    return;
  }

  const messages = [
    ...prepared.messages,
    { role: "ai" as const, text: assistantMessage },
  ].slice(-MAX_MESSAGES);
  writeJson(SESSION_KEY, {
    sessionId: prepared.sessionId,
    startedAt: prepared.startedAt,
    lastActivityAt: logging.completedAt,
    messages,
  } satisfies StoredSession);

  const payload: ConversationLogRequest = {
    ...logging,
    conversation: [
      ...prepared.requestMessages,
      { role: "assistant", content: assistantMessage },
    ],
  };
  const outbox = readOutbox().filter((item) => item.id !== logging.exchangeId);
  writeJson(
    OUTBOX_KEY,
    [
      ...outbox,
      {
        id: logging.exchangeId,
        attempts: 0,
        nextAttemptAt: Date.now(),
        payload,
      },
    ].slice(-MAX_OUTBOX_ITEMS),
  );
  void flushConversationOutbox();
}

export function initializeConversationLogging(): () => void {
  const flush = () => void flushConversationOutbox();
  window.addEventListener("online", flush);
  flush();
  return () => window.removeEventListener("online", flush);
}
