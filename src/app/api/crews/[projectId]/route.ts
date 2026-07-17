import { NextRequest, NextResponse } from "next/server";

import { getRequestIdentity } from "@/lib/ai/chat-rate-limit";
import { getActiveCrewJob, startCrewJob } from "@/lib/crews/jobs";
import { getCrewProject } from "@/lib/crews/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 900;

type Params = {
  params: Promise<{ projectId: string }>;
};

const runWindows = new Map<string, { count: number; resetAt: number }>();
const RUN_LIMIT = 4;
const RUN_WINDOW_MS = 15 * 60 * 1_000;

function message(error: string, status: number) {
  return NextResponse.json({
    ok: false,
    durationMs: 0,
    stdout: "",
    stderr: "",
    error,
  }, { status });
}

function consumeRunLimit(identity: string) {
  const now = Date.now();
  const existing = runWindows.get(identity);
  if (!existing || existing.resetAt <= now) {
    runWindows.set(identity, { count: 1, resetAt: now + RUN_WINDOW_MS });
    return true;
  }
  if (existing.count >= RUN_LIMIT) return false;
  existing.count += 1;
  return true;
}

export async function POST(request: NextRequest, { params }: Params) {
  const { projectId } = await params;
  if (!getCrewProject(projectId)) {
    return message("This agentic AI system does not exist.", 404);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 32_000) {
    return message("The request is too large.", 413);
  }

  let payload: Record<string, string>;
  try {
    const value = (await request.json()) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return message("Please provide a valid system input.", 400);
    }
    payload = Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return message("Please provide a valid system input.", 400);
  }

  const identity = getRequestIdentity(request.headers);
  const activeJob = getActiveCrewJob(identity);
  if (activeJob) {
    return NextResponse.json(
      {
        error: "Another system is already running.",
        activeJob,
      },
      { status: 409 },
    );
  }
  if (!consumeRunLimit(identity)) {
    return message(
      "This system has reached its run limit. Please try again in a few minutes.",
      429,
    );
  }

  const job = startCrewJob(projectId, payload, identity);
  return NextResponse.json(
    { job },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}

export function GET() {
  return message("Method not allowed.", 405);
}
