"use client";

import { ArrowUpRight } from "lucide-react";
import { contact } from "@/data/shayan/contact";
import { GradientText, Reveal } from "./Primitives";

export function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="pt-20 border-t"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <Reveal>
            <div className="text-center">
              <p
                className="text-[10px] tracking-[0.35em] text-white/20 uppercase mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                06 — Contact
              </p>
              <h2
                className="font-bold text-white leading-[0.9] tracking-[-0.03em] mb-6"
                style={{
                  fontSize: "clamp(2.5rem,5.5vw,5rem)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Let's build something
                <br />
                <GradientText>meaningful.</GradientText>
              </h2>
              <p
                className="text-white/30 text-lg font-light mb-14 max-w-sm mx-auto leading-[1.7]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                I am open to software engineering and applied-AI roles, internships, projects and collaborations.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                    boxShadow: "0 0 28px rgba(30,144,255,0.2), 0 4px 16px rgba(0,0,0,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Email
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  LinkedIn
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  Instagram
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={contact.githubProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/[0.09] bg-white/[0.04] text-sm font-semibold text-white/50 transition-all duration-300 hover:text-white/90 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  GitHub
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Footer */}
        <div
          className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p
            className="text-[10px] text-white/14 tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Shayan — {new Date().getFullYear()}
          </p>
          <p
            className="text-[10px] text-white/14"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Designed and built with intention.
          </p>
        </div>
      </div>
    </section>
  );
}
