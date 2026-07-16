import "server-only";

import { chatConfig } from "@/lib/ai/chat-config";
import type { ChatMessage } from "@/lib/ai/chat-validation";
import { SHAYAN_SYSTEM_PROMPT } from "@/lib/ai/shayan-system-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export type ChatServiceErrorKind =
  | "configuration"
  | "rate_limited"
  | "timeout"
  | "upstream"
  | "invalid_response";

export class ChatServiceError extends Error {
  constructor(public readonly kind: ChatServiceErrorKind) {
    super(kind);
  }
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
}

export async function createChatCompletion(
  conversation: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new ChatServiceError("configuration");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), chatConfig.requestTimeoutMs);

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": chatConfig.siteUrl,
        "X-Title": chatConfig.siteName,
      },
      body: JSON.stringify({
        model: chatConfig.model,
        messages: [
          { role: "system", content: SHAYAN_SYSTEM_PROMPT },
          ...conversation,
        ],
        temperature: chatConfig.temperature,
        top_p: chatConfig.topP,
        max_tokens: chatConfig.maxTokens,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ChatServiceError("timeout");
    }
    throw new ChatServiceError("upstream");
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) throw new ChatServiceError("rate_limited");
  if (!response.ok) throw new ChatServiceError("upstream");

  let payload: OpenRouterResponse;
  try {
    payload = (await response.json()) as OpenRouterResponse;
  } catch {
    throw new ChatServiceError("invalid_response");
  }

  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new ChatServiceError("invalid_response");
  }

  const message = content.replace(/\u0000/g, "").trim();
  if (!message) throw new ChatServiceError("invalid_response");

  return message.slice(0, 12_000);
}
