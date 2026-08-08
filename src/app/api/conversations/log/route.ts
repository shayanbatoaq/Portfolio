import { NextRequest, NextResponse } from "next/server";

import { verifyConversationEvent } from "@/lib/conversations/auth";
import { logConversationEvent } from "@/lib/conversations/logger";
import { conversationLogRequestSchema } from "@/lib/conversations/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 300_000;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Invalid logging request" }, { status: 413 });
    }
    const parsed = conversationLogRequestSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid logging request" }, { status: 400 });
    }

    const { token, ...event } = parsed.data;
    if (!verifyConversationEvent(event, token)) {
      return NextResponse.json({ error: "Invalid logging request" }, { status: 403 });
    }

    await logConversationEvent(event);
    return NextResponse.json({ logged: true });
  } catch (error) {
    console.error("Conversation logging failed", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Logging temporarily unavailable" }, { status: 503 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
