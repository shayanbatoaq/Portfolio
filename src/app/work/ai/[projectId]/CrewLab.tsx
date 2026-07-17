"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Check,
  Clock3,
  Code2,
  Copy,
  FileCode2,
  LineChart,
  LoaderCircle,
  History as HistoryIcon,
  Play,
  Radar,
  Scale,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

import type { CrewProject } from "@/lib/crews/projects";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";

type CrewRun = {
  ok: boolean;
  projectId?: string;
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

type CrewJob = {
  id: string;
  projectId: string;
  inputSummary: string;
  status: "running" | "completed" | "failed";
  startedAt: string;
  updatedAt: string;
  result?: CrewRun;
};

type HistoryEntry = {
  id: string;
  projectId: string;
  projectName: string;
  inputSummary: string;
  status: "completed" | "failed";
  startedAt: string;
  completedAt: string;
  run: CrewRun;
};

type StartRunResponse = {
  job?: CrewJob;
  activeJob?: CrewJob;
  error?: string;
};

type Props = {
  project: CrewProject;
  projects: CrewProject[];
};

const ACTIVE_RUN_KEY = "shayan:active-crew-run:v1";
const RUN_HISTORY_KEY = "shayan:crew-run-history:v1";
const HISTORY_LIMIT = 5;
const HISTORY_CHARACTER_BUDGET = 1_600_000;

function clipHistoryText(value: string | undefined, limit: number) {
  if (!value || value.length <= limit) return value ?? "";
  return `${value.slice(0, limit)}\n\n[History preview truncated]`;
}

function compactRunForHistory(run: CrewRun): CrewRun {
  let fileBudget = 200_000;
  const files = (run.files ?? []).slice(0, 8).map((file) => {
    const limit = Math.min(50_000, fileBudget);
    const content = clipHistoryText(file.content, limit);
    fileBudget = Math.max(0, fileBudget - content.length);
    return { ...file, content };
  });

  return {
    ...run,
    result: clipHistoryText(run.result, 120_000),
    files,
    stdout: clipHistoryText(run.stdout, 12_000),
    stderr: clipHistoryText(run.stderr, 12_000),
  };
}

function readRunHistory(): HistoryEntry[] {
  try {
    const stored = window.localStorage.getItem(RUN_HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveFinishedJob(job: CrewJob, projectName: string) {
  if (!job.result || job.status === "running") return readRunHistory();

  const entry: HistoryEntry = {
    id: job.id,
    projectId: job.projectId,
    projectName,
    inputSummary: job.inputSummary,
    status: job.status,
    startedAt: job.startedAt,
    completedAt: job.updatedAt,
    run: compactRunForHistory(job.result),
  };
  let entries = [
    entry,
    ...readRunHistory().filter((item) => item.id !== entry.id),
  ].slice(0, HISTORY_LIMIT);

  while (
    entries.length > 1 &&
    JSON.stringify(entries).length > HISTORY_CHARACTER_BUDGET
  ) {
    entries = entries.slice(0, -1);
  }

  while (entries.length) {
    try {
      window.localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(entries));
      return entries;
    } catch {
      entries = entries.slice(0, -1);
    }
  }
  return [];
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function initialValues(project: CrewProject) {
  return Object.fromEntries(project.fields.map((field) => [field.name, ""]));
}

function formatDuration(durationMs?: number) {
  if (!durationMs) return "";
  const seconds = Math.max(1, Math.round(durationMs / 1_000));
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function ProjectIcon({ project, size = 22 }: { project: CrewProject; size?: number }) {
  if (project.id === "debate") return <Scale size={size} />;
  if (project.id === "engineering_team") return <Code2 size={size} />;
  if (project.id === "financial_researcher") return <LineChart size={size} />;
  return <Radar size={size} />;
}

export default function CrewLab({ project, projects }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    initialValues(project),
  );
  const [run, setRun] = useState<CrewRun | null>(null);
  const [activeOutput, setActiveOutput] = useState("result");
  const [activeJob, setActiveJob] = useState<CrewJob | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const outputTabs = useMemo(() => {
    const files = run?.files ?? [];
    return [
      {
        id: "result",
        label: run?.entrypoint ? `Entrypoint · ${run.entrypoint}` : "Result",
        content: run?.result ?? "",
      },
      ...files.map((file) => ({
        id: file.path,
        label: file.path.replace(/^output\//, ""),
        content: file.content,
      })),
      ...(run?.stdout
        ? [{ id: "stdout", label: "Process log", content: run.stdout }]
        : []),
      ...(run?.stderr
        ? [{ id: "stderr", label: "Errors", content: run.stderr }]
        : []),
    ].filter((tab) => tab.content);
  }, [run]);

  const currentOutput =
    outputTabs.find((tab) => tab.id === activeOutput) ?? outputTabs[0];
  const primaryField = project.fields[0];
  const hasInput = project.fields.every((field) =>
    Boolean(values[field.name]?.trim()),
  );
  const activeProject = activeJob
    ? projects.find((item) => item.id === activeJob.projectId)
    : undefined;
  const isCurrentProjectRunning =
    activeJob?.status === "running" && activeJob.projectId === project.id;
  const controlsLocked = isSubmitting || Boolean(activeJob);

  useEffect(() => {
    let disposed = false;
    let checking = false;

    setValues(initialValues(project));
    setActiveOutput("result");
    const entries = readRunHistory();
    setHistory(entries);
    const requestedRunId = new URLSearchParams(window.location.search).get("run");
    const selectedEntry = requestedRunId
      ? entries.find(
          (entry) =>
            entry.id === requestedRunId && entry.projectId === project.id,
        )
      : entries.find((entry) => entry.projectId === project.id);
    setRun(selectedEntry?.run ?? null);
    if (selectedEntry && !selectedEntry.run.result && selectedEntry.run.files?.[0]) {
      setActiveOutput(selectedEntry.run.files[0].path);
    }

    async function syncActiveRun() {
      if (checking) return;
      checking = true;
      try {
        const storedJobId = window.localStorage.getItem(ACTIVE_RUN_KEY);
        if (storedJobId) {
          const response = await fetch(`/api/crews/runs/${storedJobId}`, {
            cache: "no-store",
          });
          if (response.ok) {
            const data = (await response.json()) as { job: CrewJob };
            if (disposed) return;
            if (data.job.status === "running") {
              setActiveJob(data.job);
              return;
            }

            window.localStorage.removeItem(ACTIVE_RUN_KEY);
            setActiveJob(null);
            const jobProject = projects.find(
              (item) => item.id === data.job.projectId,
            );
            const updatedHistory = saveFinishedJob(
              data.job,
              jobProject?.name ?? "Agent system",
            );
            setHistory(updatedHistory);
            if (data.job.projectId === project.id && data.job.result) {
              setRun(data.job.result);
              setActiveOutput(
                !data.job.result.result && data.job.result.files?.[0]
                  ? data.job.result.files[0].path
                  : "result",
              );
            }
            return;
          }
          window.localStorage.removeItem(ACTIVE_RUN_KEY);
        }

        const response = await fetch("/api/crews/runs", { cache: "no-store" });
        if (!response.ok || disposed) return;
        const data = (await response.json()) as { job: CrewJob | null };
        setActiveJob(data.job);
        if (data.job) {
          window.localStorage.setItem(ACTIVE_RUN_KEY, data.job.id);
        }
      } catch {
        // Keep the last known state during a temporary polling failure.
      } finally {
        checking = false;
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === RUN_HISTORY_KEY) setHistory(readRunHistory());
      if (event.key === ACTIVE_RUN_KEY) void syncActiveRun();
    };

    void syncActiveRun();
    const interval = window.setInterval(syncActiveRun, 1_800);
    window.addEventListener("storage", handleStorage);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [project, projects]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasInput || controlsLocked) return;

    setIsSubmitting(true);
    setRun(null);
    setActiveOutput("result");
    setCopied(false);

    try {
      const response = await fetch(`/api/crews/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as StartRunResponse;
      if (data.activeJob) {
        setActiveJob(data.activeJob);
        window.localStorage.setItem(ACTIVE_RUN_KEY, data.activeJob.id);
        return;
      }
      if (!response.ok || !data.job) {
        setRun({
          ok: false,
          durationMs: 0,
          stdout: "",
          stderr: "",
          error: data.error ?? "The crew could not be started.",
        });
        return;
      }

      setActiveJob(data.job);
      window.localStorage.setItem(ACTIVE_RUN_KEY, data.job.id);
    } catch (error) {
      setRun({
        ok: false,
        durationMs: 0,
        stdout: "",
        stderr: "",
        error:
          error instanceof Error
            ? error.message
            : "The system could not reach the agent runtime.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function showHistoryEntry(entry: HistoryEntry) {
    setRun(entry.run);
    setActiveOutput(
      !entry.run.result && entry.run.files?.[0]
        ? entry.run.files[0].path
        : "result",
    );
    window.history.replaceState(null, "", `?run=${entry.id}`);
    document.getElementById("system-output")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function copyOutput() {
    if (!currentOutput?.content) return;
    try {
      await navigator.clipboard.writeText(currentOutput.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#07070f] text-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none fixed left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: `rgba(${project.accentRgb}, 0.12)` }}
      />

      <PortfolioNav />

      <header className="relative z-20 border-b border-white/[0.06] bg-[#07070f]/75 pt-24 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 sm:tracking-[0.24em]">
            <span className="relative flex size-2">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: project.accent }}
              />
              <span
                className="relative inline-flex size-2 rounded-full"
                style={{ backgroundColor: project.accent }}
              />
            </span>
            <span className="hidden sm:inline">Agent systems online</span>
            <span className="sm:hidden">Systems online</span>
          </div>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft size={13} />
            Back to work
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <nav
          aria-label="AI systems"
          className={`flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] ${
            activeJob ? "mb-5" : "mb-12"
          }`}
        >
          {projects.map((item) => {
            const active = item.id === project.id;
            return (
              <Link
                key={item.id}
                href={`/work/ai/${item.id}`}
                aria-current={active ? "page" : undefined}
                className="group flex min-w-fit items-center gap-3 rounded-full border px-4 py-2.5 text-xs transition"
                style={{
                  background: active
                    ? `rgba(${item.accentRgb}, 0.1)`
                    : "rgba(255,255,255,0.025)",
                  borderColor: active
                    ? `rgba(${item.accentRgb}, 0.32)`
                    : "rgba(255,255,255,0.07)",
                  color: active ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.38)",
                }}
              >
                <span style={{ color: active ? item.accent : "inherit" }}>
                  <ProjectIcon project={item} size={14} />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {activeJob && activeProject && (
          <aside
            aria-live="polite"
            className="mb-12 flex flex-col gap-4 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: `rgba(${activeProject.accentRgb}, .22)`,
              background: `linear-gradient(135deg, rgba(${activeProject.accentRgb}, .09), rgba(255,255,255,.025))`,
            }}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="relative mt-1 flex size-2.5 shrink-0">
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: activeProject.accent }}
                />
                <span
                  className="relative inline-flex size-2.5 rounded-full"
                  style={{ backgroundColor: activeProject.accent }}
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-white/82">
                    {activeProject.name} is running
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-white/28">
                    <Clock3 size={11} />
                    Started {formatHistoryDate(activeJob.startedAt)}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-white/35">
                  {activeJob.inputSummary}
                </p>
              </div>
            </div>
            {isCurrentProjectRunning ? (
              <span className="inline-flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/32">
                <Activity size={13} />
                Viewing live progress
              </span>
            ) : (
              <Link
                href={`/work/ai/${activeProject.id}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-xs text-white/58 transition hover:border-white/18 hover:text-white"
              >
                Return to active run
                <ArrowRight size={13} />
              </Link>
            )}
          </aside>
        )}

        <section className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:items-end">
          <div>
            <div
              className="mb-5 text-[10px] uppercase tracking-[0.34em]"
              style={{ color: project.accent }}
            >
              System {project.number} · {project.eyebrow}
            </div>
            <h1
              className="max-w-4xl text-5xl font-bold leading-[0.94] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/42 sm:text-lg sm:leading-8">
              {project.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/38">
                {project.runtime}
              </span>
              <span className="text-xs text-white/25">{project.role}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/28">
                Agent flow
              </span>
              <Sparkles size={15} style={{ color: project.accent }} />
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2">
              {project.stages.map((stage, index) => (
                <div key={stage.label} className="contents">
                  <div className="min-w-0 text-center">
                    <div
                      className={`mx-auto grid size-11 place-items-center rounded-full border ${
                        isCurrentProjectRunning ? "animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: `rgba(${project.accentRgb}, .28)`,
                        background: `rgba(${project.accentRgb}, .08)`,
                        color: project.accent,
                      }}
                    >
                      <span className="font-mono text-xs">0{index + 1}</span>
                    </div>
                    <div className="mt-3 truncate text-xs font-semibold text-white/72">
                      {stage.label}
                    </div>
                    <div className="mt-1 hidden text-[10px] leading-4 text-white/25 sm:block">
                      {stage.detail}
                    </div>
                  </div>
                  {index < project.stages.length - 1 && (
                    <div
                      className="mt-[1.35rem] h-px w-5 sm:w-9"
                      style={{
                        background: `linear-gradient(90deg, rgba(${project.accentRgb}, .55), rgba(${project.accentRgb}, .12))`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(320px,410px)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b0b18]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/25">
                  Input console
                </div>
                <h2
                  className="mt-2 text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Brief the crew
                </h2>
              </div>
              <TerminalSquare size={19} className="text-white/22" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {project.fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-xs font-medium text-white/58"
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={values[field.name] ?? ""}
                      rows={field.rows ?? 6}
                      maxLength={12_000}
                      required
                      disabled={controlsLocked}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      className="min-h-36 w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 text-sm leading-6 text-white/82 outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] disabled:opacity-55"
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      value={values[field.name] ?? ""}
                      maxLength={200}
                      required
                      disabled={controlsLocked}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      className="h-13 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white/82 outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] disabled:opacity-55"
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {field.examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        disabled={controlsLocked}
                        onClick={() =>
                          setValues((current) => ({
                            ...current,
                            [field.name]: example,
                          }))
                        }
                        className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-left text-[10px] text-white/32 transition hover:border-white/15 hover:text-white/60 disabled:pointer-events-none"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={controlsLocked || !hasInput}
                className="flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-sm font-semibold text-[#07070f] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-35"
                style={{
                  background: `linear-gradient(135deg, ${project.accent}, rgba(${project.accentRgb}, .7))`,
                  boxShadow: hasInput
                    ? `0 16px 45px rgba(${project.accentRgb}, .16)`
                    : "none",
                }}
              >
                {isSubmitting || isCurrentProjectRunning ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Play size={15} fill="currentColor" />
                )}
                {isSubmitting
                  ? "Starting crew"
                  : isCurrentProjectRunning
                    ? "Crew in progress"
                    : activeJob
                      ? `${activeProject?.name ?? "Another crew"} is running`
                      : `Run ${project.name}`}
              </button>
            </form>

            <p className="mt-4 text-center text-[10px] leading-4 text-white/20">
              Live agent runs can take several minutes while research and review stages complete.
            </p>
          </div>

          <div
            id="system-output"
            className="min-h-[610px] scroll-mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b18]/80 shadow-2xl shadow-black/25 backdrop-blur-xl"
          >
            <div className="flex min-h-20 flex-col justify-between gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    System output
                  </h2>
                  {run && (
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]"
                      style={{
                        borderColor: run.ok
                          ? "rgba(52,211,153,.2)"
                          : "rgba(251,113,133,.2)",
                        background: run.ok
                          ? "rgba(52,211,153,.07)"
                          : "rgba(251,113,133,.07)",
                        color: run.ok ? "#6ee7b7" : "#fda4af",
                      }}
                    >
                      {run.ok ? "Complete" : "Stopped"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-white/25" aria-live="polite">
                  {isCurrentProjectRunning
                    ? "Agents are collaborating…"
                    : run
                      ? `${run.ok ? "Finished" : "Ended"} ${formatDuration(run.durationMs)}`
                      : activeJob
                        ? `${activeProject?.name ?? "Another system"} is running`
                        : "Ready for a new run"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {run?.runCommand && (
                  <code className="hidden max-w-xs overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/35 md:block">
                    {run.runCommand}
                  </code>
                )}
                <button
                  type="button"
                  onClick={copyOutput}
                  disabled={!currentOutput?.content}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[10px] text-white/38 transition hover:border-white/15 hover:text-white/75 disabled:pointer-events-none disabled:opacity-25"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {isCurrentProjectRunning && (
              <div className="grid min-h-[520px] place-items-center px-6 py-12 text-center">
                <div className="max-w-md">
                  <div className="relative mx-auto grid size-24 place-items-center">
                    <div
                      className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-current"
                      style={{ color: project.accent }}
                    />
                    <div
                      className="absolute inset-3 animate-pulse rounded-full blur-xl"
                      style={{ background: `rgba(${project.accentRgb}, .2)` }}
                    />
                    <ProjectIcon project={project} size={28} />
                  </div>
                  <h3
                    className="mt-7 text-xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The crew is thinking
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/32">
                    {project.stages.map((stage) => stage.label).join(" → ")}
                  </p>
                  <div className="mt-7 flex justify-center gap-2">
                    {project.stages.map((stage, index) => (
                      <span
                        key={stage.label}
                        className="h-1.5 w-12 animate-pulse rounded-full"
                        style={{
                          animationDelay: `${index * 180}ms`,
                          background: `rgba(${project.accentRgb}, ${0.85 - index * 0.18})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isCurrentProjectRunning && !run && (
              <div className="grid min-h-[520px] place-items-center px-6 py-12 text-center">
                <div className="max-w-md">
                  <div
                    className="mx-auto grid size-20 place-items-center rounded-3xl border"
                    style={{
                      borderColor: `rgba(${project.accentRgb}, .2)`,
                      background: `rgba(${project.accentRgb}, .06)`,
                      color: project.accent,
                    }}
                  >
                    <ProjectIcon project={project} size={27} />
                  </div>
                  <h3
                    className="mt-6 text-xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Awaiting your brief
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/30">
                    Add {primaryField.label.toLowerCase()} in the input console. The output and supporting files will appear here.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/18">
                    <span>Input</span>
                    <ArrowRight size={12} />
                    <span>Agents</span>
                    <ArrowRight size={12} />
                    <span>Result</span>
                  </div>
                </div>
              </div>
            )}

            {!isCurrentProjectRunning && run && (
              <div>
                {run.error && (
                  <div className="border-b border-rose-400/10 bg-rose-400/[0.055] px-5 py-4 text-sm leading-6 text-rose-200/80 sm:px-6">
                    {run.error}
                  </div>
                )}

                {outputTabs.length > 0 ? (
                  <>
                    <div className="flex gap-2 overflow-x-auto border-b border-white/[0.06] p-3 [scrollbar-width:none] sm:px-5">
                      {outputTabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveOutput(tab.id)}
                          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-[10px] transition"
                          style={{
                            borderColor:
                              currentOutput?.id === tab.id
                                ? `rgba(${project.accentRgb}, .28)`
                                : "rgba(255,255,255,.06)",
                            background:
                              currentOutput?.id === tab.id
                                ? `rgba(${project.accentRgb}, .09)`
                                : "rgba(255,255,255,.025)",
                            color:
                              currentOutput?.id === tab.id
                                ? "rgba(255,255,255,.84)"
                                : "rgba(255,255,255,.3)",
                          }}
                        >
                          {tab.id === "result" ? (
                            <Sparkles size={11} />
                          ) : tab.id === "stdout" || tab.id === "stderr" ? (
                            <TerminalSquare size={11} />
                          ) : (
                            <FileCode2 size={11} />
                          )}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <pre className="max-h-[720px] min-h-[470px] overflow-auto whitespace-pre-wrap break-words px-5 py-6 font-mono text-[13px] leading-6 text-white/66 sm:px-6">
                      {currentOutput?.content}
                    </pre>
                  </>
                ) : (
                  <div className="grid min-h-[470px] place-items-center p-8 text-sm text-white/28">
                    No output files were returned.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b18]/70 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/35">
                <HistoryIcon size={17} />
              </div>
              <div>
                <h2
                  className="text-base font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Recent runs
                </h2>
                <p className="mt-0.5 text-[10px] text-white/25">
                  The latest five results are kept on this device.
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
              {history.length} {history.length === 1 ? "result" : "results"}
            </span>
          </div>

          {history.length ? (
            <div className="divide-y divide-white/[0.055]">
              {history.map((entry) => {
                const entryProject = projects.find(
                  (item) => item.id === entry.projectId,
                );
                const actionClassName =
                  "inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[10px] text-white/42 transition hover:border-white/16 hover:text-white/78";
                return (
                  <article
                    key={entry.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className="grid size-10 shrink-0 place-items-center rounded-xl border"
                        style={{
                          borderColor: entryProject
                            ? `rgba(${entryProject.accentRgb}, .18)`
                            : "rgba(255,255,255,.07)",
                          background: entryProject
                            ? `rgba(${entryProject.accentRgb}, .055)`
                            : "rgba(255,255,255,.03)",
                          color: entryProject?.accent ?? "rgba(255,255,255,.4)",
                        }}
                      >
                        {entryProject ? (
                          <ProjectIcon project={entryProject} size={16} />
                        ) : (
                          <Activity size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-white/68">
                            {entry.projectName}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] ${
                              entry.status === "completed"
                                ? "bg-emerald-400/[0.07] text-emerald-300/65"
                                : "bg-rose-400/[0.07] text-rose-300/65"
                            }`}
                          >
                            {entry.status === "completed" ? "Complete" : "Stopped"}
                          </span>
                        </div>
                        <p className="mt-1 max-w-3xl truncate text-xs text-white/30">
                          {entry.inputSummary}
                        </p>
                        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[9px] text-white/18">
                          <Clock3 size={10} />
                          {formatHistoryDate(entry.completedAt)}
                        </span>
                      </div>
                    </div>

                    {entry.projectId === project.id ? (
                      <button
                        type="button"
                        onClick={() => showHistoryEntry(entry)}
                        className={actionClassName}
                      >
                        View result
                        <ArrowRight size={11} />
                      </button>
                    ) : (
                      <Link
                        href={`/work/ai/${entry.projectId}?run=${entry.id}`}
                        className={actionClassName}
                      >
                        Open result
                        <ArrowRight size={11} />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-9 text-center text-xs text-white/24">
              Completed and stopped runs will appear here automatically.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
