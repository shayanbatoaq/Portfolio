"use client";

import { aboutTopics } from "@/data/experience";
import { GradientText, Reveal } from "./Primitives";

export function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-24">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              03 — My Story
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              Behind
              <br />
              <GradientText>my work.</GradientText>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="max-w-2xl text-xl text-white/40 leading-[1.75] mb-28 font-light"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I am an early-career full-stack and AI product engineer taking a nontraditional path into software. I build across frontend, backend, APIs and data flows, with LapSignal as my strongest engineering project. I learn through building, client delivery and feedback from other engineers.
          </p>
        </Reveal>

        <div className="space-y-28">
          {aboutTopics.map((topic, i) => (
            <Reveal key={topic.label} delay={i * 60}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${
                  topic.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className="aspect-[4/3] rounded-2xl border border-white/[0.055] relative overflow-hidden"
                  style={{
                    background: topic.imageContain
                      ? "rgba(255,255,255,0.98)"
                      : `linear-gradient(135deg, ${topic.gradFrom}, ${topic.gradTo}), rgba(10,10,22,0.7)`,
                  }}
                >
                  <img
                    src={topic.image}
                    alt={topic.imageAlt}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 ${
                      topic.imageContain ? "object-contain p-10" : "object-cover"
                    }`}
                    style={{
                      filter: topic.imageContain
                        ? "none"
                        : "saturate(0.8) contrast(1.05)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: topic.imageContain
                        ? "transparent"
                        : "linear-gradient(135deg, rgba(5,5,14,0.08), rgba(5,5,14,0.58))",
                    }}
                  />
                </div>

                {/* Text */}
                <div className="space-y-5">
                  <p
                    className="text-[10px] tracking-[0.3em] text-white/25 uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {topic.label}
                  </p>
                  <h3
                    className="font-semibold text-white leading-[1.2]"
                    style={{
                      fontSize: "clamp(1.4rem,2.5vw,2rem)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {topic.heading}
                  </h3>
                  <p
                    className="text-white/45 leading-[1.8] text-[1.05rem] font-light"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {topic.body}
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
