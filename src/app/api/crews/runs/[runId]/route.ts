import { NextRequest, NextResponse } from "next/server";

import { getRequestIdentity } from "@/lib/ai/chat-rate-limit";
import { getCrewJob } from "@/lib/crews/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ runId: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { runId } = await params;
  const identity = getRequestIdentity(request.headers);
  const job = getCrewJob(runId, identity);
  if (!job) {
    return NextResponse.json(
      { error: "This run is no longer available." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { job },
    { headers: { "Cache-Control": "no-store" } },
  );
}
