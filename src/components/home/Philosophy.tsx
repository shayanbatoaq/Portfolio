"use client";

import { Gauge, Dumbbell, BrainCircuit, PenTool } from "lucide-react";
import { GradientText, Reveal } from "./Primitives";

const CHAPTERS = [
  {
    number: "I",
    icon: <Gauge size={20} strokeWidth={1.5} />,
    title: "Precision",
    subtitle: "Motorsport as my mental model.",
    body: "Motorsport is one of my clearest mental models for precision. Across F1, WEC, and IMSA, complex results depend on many connected decisions, careful preparation, and constant refinement. I bring that same attention to interfaces, implementation details, and how each part of a product supports the whole.",
    gradFrom: "rgba(30,144,255,0.08)",
    gradTo: "rgba(79,123,255,0.04)",
    borderColor: "rgba(30,144,255,0.14)",
  },
  {
    number: "II",
    icon: <Dumbbell size={20} strokeWidth={1.5} />,
    title: "Discipline",
    subtitle: "MMA taught me patience.",
    body: "MMA has taught me patience with fundamentals and the value of showing up consistently. Progress comes from repeating the basics, noticing mistakes, and returning with better control. I try to bring that discipline to learning unfamiliar tools and working through difficult product problems.",
    gradFrom: "rgba(106,90,205,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,90,205,0.14)",
  },
  {
    number: "III",
    icon: <BrainCircuit size={20} strokeWidth={1.5} />,
    title: "Curiosity",
    subtitle: "Applied AI is where I want to grow.",
    body: "I have pursued applied AI through self-directed prototypes and an Agentic AI internship. The tools and patterns change quickly, so I keep testing ideas, learning from stronger engineers, and improving how I connect models to useful interfaces and workflows.",
    gradFrom: "rgba(106,10,173,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,10,173,0.14)",
  },
  {
    number: "IV",
    icon: <PenTool size={20} strokeWidth={1.5} />,
    title: "Creation",
    subtitle: "Software is just the medium.",
    body: "Code is the material, not the point. I try to build interfaces that make the next action clear and the overall experience considered. Whether the work is a website or an AI prototype, usefulness is the goal and implementation is how I support it.",
    gradFrom: "rgba(138,43,226,0.08)",
    gradTo: "rgba(106,10,173,0.04)",
    borderColor: "rgba(138,43,226,0.14)",
  },
];

export function Philosophy() {
  return (
    <section id="philosophy" className="mt-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-20">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              My Philosophy
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              How I think
              <br />
              <GradientText>about everything.</GradientText>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CHAPTERS.map((ch, i) => (
            <Reveal key={ch.title} delay={i * 90}>
              <div
                className="group relative rounded-2xl overflow-hidden h-full transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(145deg, ${ch.gradFrom}, ${ch.gradTo}), rgba(10,10,20,0.85)`,
                  border: `1px solid ${ch.borderColor}`,
                  padding: "2.5rem",
                }}
              >
                {/* Subtle sheen on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-7">
                    <span
                      className="text-[10px] tracking-[0.3em] text-white/20 uppercase"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Chapter {ch.number}
                    </span>
                    <span className="text-xl text-white/12 group-hover:text-white/22 transition-colors duration-300">
                      {ch.icon}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-white mb-2"
                    style={{
                      fontSize: "clamp(1.6rem,2.5vw,2rem)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {ch.title}
                  </h3>
                  <p
                    className="text-sm text-white/30 italic mb-5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {ch.subtitle}
                  </p>
                  <p
                    className="text-white/50 leading-[1.8] text-[0.95rem]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {ch.body}
                  </p>

                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
