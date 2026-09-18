"use client";

import { ArrowUpRight } from "lucide-react";
import { patricians } from "@/data/shayan/work";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import { GradientText, Reveal } from "./Primitives";

export function Patricians() {
  return (
    <section id="patricians" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(30,144,255,0.055) 0%, rgba(106,10,173,0.07) 100%), rgba(9,9,20,0.9)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                "0 0 80px rgba(30,144,255,0.05), 0 32px 80px rgba(0,0,0,0.45)",
              backdropFilter: "blur(24px)",
              padding: "clamp(2.5rem,5vw,5rem)",
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top right, rgba(138,43,226,0.08) 0%, transparent 65%)",
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <p
                  className="text-[10px] tracking-[0.35em] text-white/22 uppercase mb-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  04 — Patricians
                </p>
                <h2
                  className="font-bold text-white leading-[0.9] tracking-[-0.03em] mb-6"
                  style={{
                    fontSize: "clamp(2.2rem,4.5vw,4rem)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Co-founder of
                  <br />
                  <GradientText>Patricians.</GradientText>
                </h2>
                <p
                  className="text-white/42 text-lg leading-[1.75] mb-10 font-light"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {patricians.description}
                </p>
                <a
                  href="https://patricians.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() =>
                    emitSceneReaction("patricians-hover", 1)
                  }
                  onFocus={() => emitSceneReaction("patricians-hover", 1)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #1E90FF, #6A0DAD)",
                    boxShadow: "0 0 36px rgba(30,144,255,0.18), 0 4px 16px rgba(0,0,0,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Visit Patricians
                  <ArrowUpRight size={15} />
                </a>
              </div>

              {/* Logo card */}
              <div className="flex justify-center lg:justify-end">
                <a
                  href="https://patricians.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Patricians"
                  onMouseEnter={() =>
                    emitSceneReaction("patricians-hover", 1.15)
                  }
                  onFocus={() =>
                    emitSceneReaction("patricians-hover", 1.15)
                  }
                  className="w-full max-w-md aspect-[2/1] rounded-2xl flex items-center justify-center p-6 sm:p-8"
                  style={{
                    background: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <img
                    src="/assets/patricians-wordmark.png"
                    alt="Patricians"
                    width={1080}
                    height={181}
                    className="w-full h-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
