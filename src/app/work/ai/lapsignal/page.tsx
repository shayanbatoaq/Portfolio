import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { WorkflowStages } from "@/components/work/WorkflowStages";
import { lapsignal } from "@/data/lapsignal";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "LapSignal — Sim Racing Telemetry & Coaching System",
  description: lapsignal.description,
  alternates: { canonical: lapsignal.href },
  openGraph: {
    title: "LapSignal — Full-Stack & AI Engineering by Shayan Batoaq",
    description: lapsignal.description,
    url: absoluteUrl(lapsignal.href),
    type: "website",
    images: [{ url: lapsignal.image, alt: lapsignal.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LapSignal — Sim Racing Telemetry & Coaching System",
    description: lapsignal.description,
    images: [lapsignal.image],
  },
};

export default function LapSignalPage() {
  const metadataRows = [
    ["Category", lapsignal.categoryLabel],
    ["Type", lapsignal.type],
    ["Status", lapsignal.status],
    ["My role", lapsignal.role],
    ["Disciplines", lapsignal.disciplines.join(" · ")],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070f] text-white" style={{ fontFamily: "var(--font-body)" }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
      />
      <div
        className="pointer-events-none fixed left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: `rgba(${lapsignal.accentRgb}, 0.12)` }}
      />
      <PortfolioNav />
      <header className="relative z-20 border-b border-white/[0.06] bg-[#07070f]/75 pt-24 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 sm:tracking-[0.24em]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ backgroundColor: lapsignal.accent }} />
              <span className="relative inline-flex size-2 rounded-full" style={{ backgroundColor: lapsignal.accent }} />
            </span>
            {lapsignal.categoryLabel}
          </div>
          <Link href="/?work=ai#work" className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white">
            <ArrowLeft size={13} /> Back to work
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <section className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:items-end">
          <div>
            <div className="mb-5 text-[10px] uppercase tracking-[0.34em]" style={{ color: lapsignal.accent }}>{lapsignal.status} · Telemetry &amp; coaching</div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.94] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-display)" }}>{lapsignal.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/42 sm:text-lg sm:leading-8">{lapsignal.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/38">{lapsignal.categoryLabel}</span>
              <span className="text-xs text-white/25">{lapsignal.role}</span>
            </div>
            <a href={lapsignal.demoUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white">
              View Web Demo <ArrowUpRight size={13} />
            </a>
          </div>
          <WorkflowStages stages={lapsignal.stages} accent={lapsignal.accent} accentRgb={lapsignal.accentRgb} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(320px,410px)_minmax(0,1fr)]" aria-label="Project details">
          <aside className="rounded-3xl border border-white/[0.07] bg-[#0b0b18]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <h2 className="text-[10px] uppercase tracking-[0.24em] text-white/25">Project details</h2>
            <dl className="mt-6 border-t border-white/[0.09]">
              {metadataRows.map(([label, value]) => (
                <div key={label} className="border-b border-white/[0.09] py-4">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-blue-200/50">{label}</dt>
                  <dd className="mt-2 text-sm leading-7 text-white/58">{value}</dd>
                </div>
              ))}
            </dl>
            <h2 className="mb-4 mt-8 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Technology</h2>
            <div className="flex flex-wrap gap-1.5">
              {lapsignal.stack.map((tag) => (
                <span key={tag} className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] tracking-wide text-white/30">{tag}</span>
              ))}
            </div>
            <h2 className="mb-4 mt-8 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Key features</h2>
            <ul className="space-y-3">
              {lapsignal.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 border-t border-white/[0.07] pt-3 text-sm leading-6 text-white/55">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-blue-300 to-purple-400" aria-hidden="true" />{feature}
                </li>
              ))}
            </ul>
          </aside>
          <article className="rounded-3xl border border-white/[0.07] bg-[#0b0b18]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <h2 className="text-[10px] uppercase tracking-[0.24em] text-white/25">Behind the system</h2>
            <dl className="mt-6 border-t border-white/[0.09]">
              {lapsignal.sections.map((section, index) => (
                <div key={section.label} className="grid gap-3 border-b border-white/[0.09] py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
                  <dt className="flex items-start gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-blue-200/50">
                    <span className="text-white/18">{String(index + 1).padStart(2, "0")}</span>{section.label}
                  </dt>
                  <dd className="text-sm leading-7 text-white/58">{section.text}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>

        <section className="scroll-mt-40 py-20 sm:py-28" aria-labelledby="interface-heading">
          <div className="mb-9">
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-blue-300/65">The web experience</p>
            <h2 id="interface-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Inside LapSignal</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/58">{lapsignal.demoNote}</p>
          </div>
          <div className="grid items-start gap-5 sm:grid-cols-2">
            {lapsignal.screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} sizes="(max-width: 640px) 100vw, 50vw" className="h-auto w-full" />
                <figcaption className="px-5 py-4 text-xs leading-6 text-white/45">{screenshot.caption} · Representative preview data</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <footer className="border-t border-white/[0.08] py-12 sm:py-16">
          <Link href="/?work=ai#work" className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm text-white/52 outline-none transition hover:text-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400">
            <ArrowLeft size={15} aria-hidden="true" /> Back to work
          </Link>
        </footer>
      </main>
    </div>
  );
}
