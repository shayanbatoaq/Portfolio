import "server-only";

import { isNotionClientError } from "@notionhq/client";

const TEMPORARY_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);

function isTemporaryFailure(error: unknown): boolean {
  if (!isNotionClientError(error)) return false;
  const status = "status" in error ? error.status : undefined;
  return typeof status === "number" && TEMPORARY_STATUSES.has(status);
}

export async function withNotionRetry<T>(
  operation: () => Promise<T>,
  recoverAfterFailure?: () => Promise<T | null>,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= 3 || !isTemporaryFailure(error)) throw error;
      const recovered = await recoverAfterFailure?.();
      if (recovered !== undefined && recovered !== null) return recovered;
      const delayMs = 250 * 2 ** attempt + Math.floor(Math.random() * 100);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempt += 1;
    }
  }
}
