import "server-only";

import { chatConfig } from "@/lib/ai/chat-config";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requests = new Map<string, RateLimitEntry>();

export function getRequestIdentity(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headers.get("x-real-ip")?.trim() || "unknown";
}

export function consumeRateLimit(identity: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const existing = requests.get(identity);

  if (!existing || existing.resetAt <= now) {
    requests.set(identity, {
      count: 1,
      resetAt: now + chatConfig.rateLimitWindowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= chatConfig.rateLimitMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1_000),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
