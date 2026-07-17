import "server-only";

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { getCrewProject } from "./projects";

type RunnerPayload = Record<string, string>;

export type CrewRunOutput = {
  ok: boolean;
  projectId: string;
  durationMs: number;
  result?: string;
  files?: { path: string; content: string }[];
  entrypoint?: string;
  runCommand?: string;
  language?: string;
  stdout: string;
  stderr: string;
  error?: string;
};

function parseEnvFile(filePath: string) {
  if (!existsSync(filePath)) return {};

  const values: Record<string, string> = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function failure(projectId: string, error: string): CrewRunOutput {
  return {
    ok: false,
    projectId,
    durationMs: 0,
    stdout: "",
    stderr: "",
    error,
  };
}

export async function runCrew(
  projectId: string,
  payload: RunnerPayload,
): Promise<CrewRunOutput> {
  const project = getCrewProject(projectId);
  if (!project) return failure(projectId, "Unknown agentic AI system.");

  const appRoot = process.cwd();
  const workspaceRoot = process.env.CREWAI_WORKSPACE_ROOT
    ? path.resolve(process.env.CREWAI_WORKSPACE_ROOT)
    : path.resolve(appRoot, "..", "..");
  const projectRoot = path.join(workspaceRoot, project.folder);
  const scriptPath = process.env.CREWAI_RUNNER_PATH
    ? path.resolve(process.env.CREWAI_RUNNER_PATH)
    : path.join(workspaceRoot, "crewai", "scripts", "run_crew.py");
  const rootEnv = parseEnvFile(path.join(workspaceRoot, ".env"));

  if (!existsSync(projectRoot)) {
    return failure(projectId, `Project folder not found: ${project.folder}`);
  }
  if (!existsSync(scriptPath)) {
    return failure(projectId, "The CrewAI runner could not be found.");
  }

  const openRouterKey =
    process.env.OPENROUTER_API_KEY || rootEnv.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    return failure(projectId, "The AI runtime is not configured yet.");
  }

  const childEnv = {
    ...process.env,
    ...rootEnv,
    OPENROUTER_API_KEY: openRouterKey,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || openRouterKey,
    OPENAI_BASE_URL: "https://openrouter.ai/api/v1",
    OPENAI_API_BASE: "https://openrouter.ai/api/v1",
    LITELLM_LOG: process.env.LITELLM_LOG || "ERROR",
    PYTHONUNBUFFERED: "1",
    PYTHONIOENCODING: "utf-8",
    PYTHONUTF8: "1",
  };
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const child = spawn("uv", ["run", "python", scriptPath, projectId], {
      cwd: projectRoot,
      env: childEnv,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (output: CrewRunOutput) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(output);
    };
    const timeout = setTimeout(() => {
      child.kill();
      finish({
        ...failure(projectId, "The crew run exceeded the 15 minute limit."),
        durationMs: Date.now() - startedAt,
        stdout,
        stderr,
      });
    }, 15 * 60 * 1_000);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      finish({
        ...failure(
          projectId,
          error instanceof Error
            ? error.message
            : "The CrewAI process could not be started.",
        ),
        durationMs: Date.now() - startedAt,
        stdout,
        stderr,
      });
    });
    child.on("close", (code) => {
      if (settled) return;

      const marker = "__CREWAI_RESULT__";
      const markerIndex = stdout.lastIndexOf(marker);
      if (markerIndex === -1) {
        finish({
          ...failure(
            projectId,
            code === 0 ? "The crew returned no output." : "The crew run failed.",
          ),
          durationMs: Date.now() - startedAt,
          stdout,
          stderr,
        });
        return;
      }

      const rawJson = stdout.slice(markerIndex + marker.length).trim();
      const visibleStdout = stdout.slice(0, markerIndex).trim();
      try {
        const parsed = JSON.parse(rawJson) as Omit<
          CrewRunOutput,
          "stdout" | "stderr" | "durationMs"
        >;
        finish({
          ...parsed,
          ok: code === 0 && parsed.ok,
          projectId,
          durationMs: Date.now() - startedAt,
          stdout: visibleStdout,
          stderr,
          error:
            code === 0
              ? parsed.error
              : parsed.error || `Crew process exited with code ${code}.`,
        });
      } catch {
        finish({
          ...failure(projectId, "The crew output could not be parsed."),
          durationMs: Date.now() - startedAt,
          stdout,
          stderr,
        });
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}
