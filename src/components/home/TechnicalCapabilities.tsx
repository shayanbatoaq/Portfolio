"use client";

import { capabilityGroups } from "@/data/shayan/skills";
import { GradientText, Reveal } from "./Primitives";

export function TechnicalCapabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-white/25">02 — Technical Capabilities</p>
          <h2 className="mb-10 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">Across the <GradientText>product stack.</GradientText></h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {capabilityGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 55} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.07] bg-[#090913]/75 p-7 backdrop-blur-xl">
                <h3 className="mb-5 text-base font-semibold text-white/80">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => <li key={item} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">{item}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
