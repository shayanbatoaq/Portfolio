import { NextRequest, NextResponse } from "next/server";

import { getRequestIdentity } from "@/lib/ai/chat-rate-limit";
import { getActiveCrewJob } from "@/lib/crews/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const identity = getRequestIdentity(request.headers);
  const job = getActiveCrewJob(identity) ?? null;
  return NextResponse.json(
    { job },
    { headers: { "Cache-Control": "no-store" } },
  );
}
