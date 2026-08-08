import "server-only";

import { randomUUID } from "node:crypto";

import type { CrewRunOutput } from "./runner";
import { runCrew } from "./runner";

export type CrewRunJobStatus = "running" | "completed" | "failed";

type StoredCrewRunJob = {
  id: string;
  identity: string;
  projectId: string;
  inputSummary: string;
  status: CrewRunJobStatus;
  startedAt: string;
  updatedAt: string;
  result?: CrewRunOutput;
};

export type PublicCrewRunJob = Omit<StoredCrewRunJob, "identity">;

type CrewJobStore = {
  jobs: Map<string, StoredCrewRunJob>;
  activeByIdentity: Map<string, string>;
};

declare global {
  var __shayanCrewJobStore: CrewJobStore | undefined;
}

const store =
  globalThis.__shayanCrewJobStore ??
  (globalThis.__shayanCrewJobStore = {
    jobs: new Map<string, StoredCrewRunJob>(),
    activeByIdentity: new Map<string, string>(),
  });

const JOB_RETENTION_MS = 6 * 60 * 60 * 1_000;
const MAX_RETAINED_JOBS = 24;

function summarizeInput(payload: Record<string, string>) {
  const value = Object.values(payload).find((entry) => entry.trim());
  if (!value) return "Untitled run";
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length > 160 ? `${normalized.slice(0, 157)}…` : normalized;
}

function userFacingError(error?: string) {
  if (!error) return undefined;
  const lowered = error.toLowerCase();
  if (lowered.includes("more credits") || lowered.includes('"code":402')) {
    return "The AI provider does not have enough credits to complete this run. Add credits or choose a smaller model, then try again.";
  }
  if (lowered.includes("rate limit") || lowered.includes('"code":429')) {
    return "The AI provider is receiving too many requests. Wait briefly, then try again.";
  }
  if (lowered.includes("timeout") || lowered.includes("timed out")) {
    return "The crew took too long to respond. Please try the run again.";
  }

  const safeValidationError =
    error.length <= 240 &&
    !error.includes("{") &&
    !error.includes("\\") &&
    !lowered.includes("traceback") &&
    !lowered.includes("exception");
  return safeValidationError
    ? error
    : "The crew could not complete this run. Please try again in a moment.";
}

function publicResult(result?: CrewRunOutput) {
  if (!result) return undefined;
  if (result.ok) return { ...result, stderr: "" };
  return {
    ...result,
    stdout: "",
    stderr: "",
    error: userFacingError(result.error),
  };
}

function publicJob(job: StoredCrewRunJob): PublicCrewRunJob {
  const { identity: _identity, ...visibleJob } = job;
  return { ...visibleJob, result: publicResult(visibleJob.result) };
}

function cleanupJobs() {
  const now = Date.now();
  const completedJobs = [...store.jobs.values()]
    .filter((job) => job.status !== "running")
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt));

  for (const job of completedJobs) {
    const expired = now - Date.parse(job.updatedAt) > JOB_RETENTION_MS;
    const overLimit = store.jobs.size > MAX_RETAINED_JOBS;
    if (!expired && !overLimit) continue;
    store.jobs.delete(job.id);
  }
}

export function getActiveCrewJob(identity: string) {
  const jobId = store.activeByIdentity.get(identity);
  if (!jobId) return undefined;

  const job = store.jobs.get(jobId);
  if (!job || job.status !== "running") {
    store.activeByIdentity.delete(identity);
    return undefined;
  }
  return publicJob(job);
}

export function getCrewJob(jobId: string, identity: string) {
  const job = store.jobs.get(jobId);
  if (!job || job.identity !== identity) return undefined;
  return publicJob(job);
}

export async function startCrewJob(
  projectId: string,
  payload: Record<string, string>,
  identity: string,
) {
  cleanupJobs();
  const timestamp = new Date().toISOString();
  const job: StoredCrewRunJob = {
    id: randomUUID(),
    identity,
    projectId,
    inputSummary: summarizeInput(payload),
    status: "running",
    startedAt: timestamp,
    updatedAt: timestamp,
  };

  store.jobs.set(job.id, job);
  store.activeByIdentity.set(identity, job.id);

  try {
    const result = await runCrew(projectId, payload);
    job.result = result;
    job.status = result.ok ? "completed" : "failed";
    job.updatedAt = new Date().toISOString();
  } catch (error: unknown) {
    job.result = {
      ok: false,
      projectId,
      durationMs: Date.now() - Date.parse(job.startedAt),
      stdout: "",
      stderr: "",
      error:
        error instanceof Error
          ? error.message
          : "The crew stopped unexpectedly.",
    };
    job.status = "failed";
    job.updatedAt = new Date().toISOString();
  } finally {
    if (store.activeByIdentity.get(identity) === job.id) {
      store.activeByIdentity.delete(identity);
    }
  }

  return publicJob(job);
}
