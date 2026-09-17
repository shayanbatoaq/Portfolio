"use client";

import { FileText, Download } from "lucide-react";
import { resume } from "@/data/shayan/resume";
import { Reveal } from "./Primitives";

export function Resume() {
  return (
    <section id="resume" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2rem] px-7 py-10 sm:px-12 sm:py-12 lg:px-16"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,144,255,0.09), rgba(106,90,205,0.07) 55%, rgba(255,255,255,0.025))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full blur-3xl"
              style={{ background: "rgba(30,144,255,0.12)" }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex max-w-2xl flex-col items-start sm:flex-row sm:items-center sm:gap-7">
                <div
                  className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:mb-0"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <FileText size={26} className="text-white/70" aria-hidden="true" />
                </div>

                <div>
                  <p
                    className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/25"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    05 — Resume
                  </p>
                  <h2
                    className="mb-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The full story, on one page.
                  </h2>
                  <p
                    className="max-w-xl text-sm font-light leading-[1.8] text-white/35 sm:text-base"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Explore my experience, capabilities, and the work behind the ideas.
                    Download a copy of my resume for a closer look.
                  </p>
                </div>
              </div>

              <a
                href={resume.href}
                download={resume.filename}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:opacity-90 active:scale-[0.97] sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                  boxShadow:
                    "0 0 28px rgba(30,144,255,0.2), 0 4px 16px rgba(0,0,0,0.3)",
                  fontFamily: "var(--font-body)",
                }}
                aria-label="Download Shayan Batoaq's resume as a PDF"
              >
                Download Resume
                <Download size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
