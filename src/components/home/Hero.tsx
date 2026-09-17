"use client";

import { ChevronDown } from "lucide-react";
import { contact } from "@/data/shayan/contact";
import { GradientText, Reveal } from "./Primitives";

export function Hero({ onAskClick }: { onAskClick: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-32 overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(30,144,255,0.055) 0%, rgba(106,10,173,0.03) 55%, transparent 80%)",
        }}
      />
      {/* Very subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center w-full">
        <Reveal>
          <p
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] tracking-[0.35em] text-white/25 uppercase mb-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span>Full-Stack &amp; AI Product Engineer</span>
            <span aria-hidden="true">·</span>
            <span>Builder</span>
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mb-14 flex justify-center select-none">
            <span className="sr-only">
              Shayan Batoaq — Full-Stack &amp; AI Product Engineer · Builder
            </span>
            <img
              src="/assets/shayan-batoaq-logo.png"
              alt=""
              aria-hidden="true"
              width={1597}
              height={256}
              className="h-auto w-full max-w-[1024px]"
              draggable={false}
            />
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p
            className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 font-light text-white/55 tracking-wide mb-7"
            style={{
              fontSize: "clamp(1.1rem,2.8vw,2.2rem)",
              fontFamily: "var(--font-display)",
            }}
          >
            <span>I build software that connects</span>
            <GradientText
              className="inline-block"
              tone="hero"
            >
              product, data and AI.
            </GradientText>
          </p>
        </Reveal>

        <Reveal delay={270}>
          <p
            className="max-w-lg mx-auto text-base text-white/35 leading-[1.75] mb-12"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Full-stack product engineer working with TypeScript, Next.js, Python and FastAPI. Currently building LapSignal, a real-time telemetry and AI coaching platform for sim racing.
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#work"
              className="px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                boxShadow: "0 0 28px rgba(30,144,255,0.22), 0 4px 16px rgba(0,0,0,0.3)",
                fontFamily: "var(--font-body)",
              }}
            >
              View Engineering Work
            </a>
            <button
              onClick={onAskClick}
              className="px-7 py-3.5 rounded-full text-sm font-semibold text-white/55 hover:text-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(12px)",
                fontFamily: "var(--font-body)",
              }}
            >
              Ask Me
            </button>
          </div>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-xs text-white/40 underline-offset-4 hover:text-white/80 hover:underline">GitHub ↗</a>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/15">
        <span
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <ChevronDown size={12} className="animate-bounce" />
      </div>
    </section>
  );
}
