"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scale, Code2, LineChart, Radar, BrainCircuit } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { emitSceneReaction } from "@/lib/three/sceneEvents";

function AgentSystemPreview({ project }: { project: Project }) {
  const icons = {
    debate: Scale,
    engineering_team: Code2,
    financial_researcher: LineChart,
    stock_picker: Radar,
  };
  const Icon = icons[project.id as keyof typeof icons] ?? BrainCircuit;
  const stages = project.visual?.stages ?? [];

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="text-[9px] uppercase tracking-[0.24em]"
          style={{ color: `hsla(${project.hue}, 82%, 72%, .72)` }}
        >
          AI workflow prototype
        </span>
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-white/24">
          <span
            className="size-1.5 rounded-full shadow-[0_0_10px_currentColor]"
            style={{
              color: `hsl(${project.hue}, 80%, 68%)`,
              background: "currentColor",
            }}
          />
          Available
        </span>
      </div>

      <div className="relative flex items-center justify-center gap-2">
        {stages.map((stage, index) => (
          <div key={stage} className="contents">
            <div className="min-w-0 text-center">
              <div
                className="mx-auto grid size-10 place-items-center rounded-full border font-mono text-[10px] transition duration-500 group-hover:scale-110"
                style={{
                  borderColor: `hsla(${project.hue}, 75%, 65%, .22)`,
                  background: `hsla(${project.hue}, 75%, 55%, .07)`,
                  color: `hsla(${project.hue}, 82%, 76%, .8)`,
                }}
              >
                {index === 1 ? <Icon size={15} /> : `0${index + 1}`}
              </div>
              <div className="mt-2 max-w-16 truncate text-[9px] text-white/34">
                {stage}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div
                className="mb-5 h-px w-6"
                style={{
                  background: `linear-gradient(90deg, hsla(${project.hue}, 75%, 65%, .45), hsla(${project.hue}, 75%, 65%, .08))`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-between border-t border-white/[0.055] pt-3">
        <span className="font-mono text-[9px] tracking-[0.18em] text-white/20">
          {project.visual?.code} / LAB
        </span>
        <span
          className="text-[9px] tracking-[0.14em]"
          style={{ color: `hsla(${project.hue}, 82%, 72%, .55)` }}
        >
          READY
        </span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const containsLogo = project.imageFit === "contain";

  return (
    <div
      className="group relative min-h-[460px] h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
      onMouseEnter={() => emitSceneReaction("project-hover", 1)}
      onFocus={() => emitSceneReaction("project-hover", 0.8)}
      style={{
        background: "rgba(9,9,19,0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 28px rgba(0,0,0,0.35)",
      }}
    >
      {/* Screenshot area */}
      <div
        className="aspect-[16/9] shrink-0 relative border-b border-white/[0.04] flex items-center justify-center overflow-hidden"
        style={{
          background:
            project.imageBackground ??
            `radial-gradient(ellipse at 40% 40%, hsla(${project.hue}, 70%, 45%, 0.13) 0%, transparent 65%), rgba(10,10,22,0.9)`,
        }}
      >
        {project.visual ? (
          <AgentSystemPreview project={project} />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? ""}
            loading="lazy"
            className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.04] ${
              containsLogo ? "object-contain p-8" : "object-cover opacity-80"
            }`}
            style={{
              filter: project.imageFilter ?? (containsLogo ? "none" : "saturate(0.75) contrast(1.08)"),
            }}
          />
        ) : null}
        {!project.visual && !containsLogo && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(5,5,14,0.2), rgba(5,5,14,0.5))",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
          </>
        )}
        {!project.url && !project.href && !project.visual && (
          <span
            className="text-white/10 text-[10px] tracking-[0.3em] uppercase z-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            AI Project
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-1 flex-col">
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[9px] text-white/30 tracking-wide"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "var(--font-body)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className="text-base font-semibold text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm text-white/38 leading-[1.7] mb-5 line-clamp-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
        {project.href && (
          <Link
            href={project.href}
            className="mt-auto inline-flex items-center gap-2 text-[11px] text-white/35 transition-colors duration-200 hover:text-white/80 group/lnk"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.cta ?? "View project"}
            <ArrowRight
              size={11}
              className="transition-transform duration-200 group-hover/lnk:translate-x-1"
            />
          </Link>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-[11px] text-white/28 hover:text-white/65 transition-colors duration-200 group/lnk"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.cta ?? "Visit site"}
            <ArrowUpRight
              size={11}
              className="group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5 transition-transform duration-200"
            />
          </a>
        )}
      </div>
    </div>
  );
}
