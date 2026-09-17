"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { lapsignal } from "@/data/lapsignal";
import { LapSignalArchitecture } from "@/components/work/LapSignalArchitecture";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import { GradientText, Reveal } from "./Primitives";

export function LapSignalFeature() {
  return (
    <Reveal className="mb-14">
      <article className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090913]/80 shadow-2xl shadow-black/25 backdrop-blur-xl" onMouseEnter={() => emitSceneReaction("project-hover", 1)}>
        <div className="grid lg:grid-cols-2">
          <div className="p-7 sm:p-10">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-blue-300/65">Flagship engineering case study · {lapsignal.status}</p>
            <h3 className="mb-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl"><GradientText>LapSignal</GradientText></h3>
            <p className="text-base leading-7 text-white/55">{lapsignal.description}</p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-white/45">
              {lapsignal.highlights.map((highlight) => <li key={highlight} className="flex gap-3"><span aria-hidden="true" className="text-blue-400/70">↗</span>{highlight}</li>)}
            </ul>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href={lapsignal.href} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#6A5ACD] px-5 py-3 text-xs font-semibold text-white">Read Case Study <ArrowRight size={13} /></Link>
              <a href={lapsignal.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-xs text-white/65">View Live Showcase <ArrowUpRight size={13} /></a>
            </div>
          </div>
          <figure className="flex flex-col justify-center border-t border-white/[0.06] bg-black/20 p-5 sm:p-8 lg:border-l lg:border-t-0">
            <Link href={lapsignal.href} aria-label="Explore the LapSignal engineering case study">
              <Image src="/assets/projects/lapsignal/cover.png" alt="LapSignal interface showing a circuit map and telemetry workspace" width={1265} height={712} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full rounded-xl border border-white/[0.08]" />
            </Link>
            <figcaption className="mt-4 text-xs leading-6 text-white/35">Read-only showcase with representative telemetry. Live capture and backend processing run in the local application.</figcaption>
            <div className="mt-5 flex flex-wrap gap-2">{lapsignal.tags.map((tag) => <span key={tag} className="rounded border border-white/[0.06] px-2 py-1 text-[10px] text-white/40">{tag}</span>)}</div>
          </figure>
        </div>
        <div className="px-7 pb-8 sm:px-10"><LapSignalArchitecture /></div>
      </article>
    </Reveal>
  );
}
