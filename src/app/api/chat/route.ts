import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { chatConfig } from "@/lib/ai/chat-config";
import {
  consumeRateLimit,
  getRequestIdentity,
} from "@/lib/ai/chat-rate-limit";
import { parseChatRequest } from "@/lib/ai/chat-validation";
import {
  ChatServiceError,
  createChatCompletion,
} from "@/lib/ai/openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR = "I could not respond just now. Please try again in a moment.";
const RATE_LIMIT_ERROR =
  "Too many requests were sent in a short period. Please wait briefly and try again.";

function errorResponse(message: string, status: number, retryAfter?: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    }
  );
}

export async function POST(request: NextRequest) {
  const rateLimit = consumeRateLimit(getRequestIdentity(request.headers));
  if (!rateLimit.allowed) {
    return errorResponse(RATE_LIMIT_ERROR, 429, rateLimit.retryAfterSeconds);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > chatConfig.maxRequestBodyBytes) {
      return errorResponse("The message is too large to send.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Please send a valid chat message.", 400);
  }

  let conversation;
  try {
    conversation = parseChatRequest(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Please enter a valid message before sending.", 400);
    }
    return errorResponse("Please send a valid chat message.", 400);
  }

  try {
    const message = await createChatCompletion(conversation);
    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      if (error.kind === "rate_limited") {
        return errorResponse(RATE_LIMIT_ERROR, 429);
      }

      console.error("Chat provider request failed", { kind: error.kind });
      return errorResponse(GENERIC_ERROR, 503);
    }

    console.error("Chat request failed unexpectedly");
    return errorResponse(GENERIC_ERROR, 500);
  }
}

export function GET() {
  return errorResponse("Method not allowed.", 405);
}
