"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import type { BrandSystemProject } from "@/data/brandSystems";
import { BrandAssetVisual } from "./BrandAssetVisual";

type BrandSystemCardProps = {
  project: BrandSystemProject;
  index: number;
};

export function BrandSystemCard({ project, index }: BrandSystemCardProps) {
  const previewAssets = project.gallery.slice(0, 4);

  const moveLight = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x / rect.width - 0.5) * 2;
    const dy = (y / rect.height - 0.5) * 2;

    event.currentTarget.style.setProperty("--brand-pointer-x", `${x}px`);
    event.currentTarget.style.setProperty("--brand-pointer-y", `${y}px`);
    event.currentTarget.style.setProperty("--brand-shift-x", dx.toFixed(3));
    event.currentTarget.style.setProperty("--brand-shift-y", dy.toFixed(3));
  };

  const resetLight = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--brand-shift-x", "0");
    event.currentTarget.style.setProperty("--brand-shift-y", "0");
  };

  return (
    <article
      className="brand-system-card brand-system-enter group relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-white/[0.035]"
      style={{ animationDelay: `${Math.min(index * 75, 300)}ms` }}
      onPointerMove={moveLight}
      onPointerLeave={resetLight}
    >
      <Link
        href={`/work/brand-systems/${project.slug}`}
        className="relative z-10 block h-full rounded-[1.75rem] p-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#07070f] sm:p-5"
        aria-label={`Explore the ${project.name} brand and marketing case study`}
      >
        <div className="flex items-start justify-between gap-4 px-1 pb-4 pt-1">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
              <Image
                src={project.logo.src}
                alt={project.logo.alt}
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </span>
            <div className="min-w-0">
              <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                {project.industry}
              </p>
              <h4 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[1.75rem]">
                {project.name}
              </h4>
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition-colors duration-300 group-hover:border-blue-400/30 group-hover:text-blue-200">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>

        <div className="brand-system-preview relative grid h-[19rem] grid-cols-[1.45fr_0.85fr] grid-rows-2 gap-2 overflow-hidden rounded-[1.2rem] border border-white/[0.08] bg-[#090a16] sm:h-[22rem]">
          {previewAssets.map((asset, assetIndex) => (
            <div
              key={asset.src}
              className={`brand-preview-layer relative min-h-0 overflow-hidden border-white/[0.07] ${
                assetIndex === 0 ? "row-span-2 border-r" : "border-b last:border-b-0"
              }`}
              style={{ "--brand-layer": assetIndex + 1 } as CSSProperties}
            >
              <BrandAssetVisual
                asset={asset}
                sizes="(max-width: 768px) 70vw, 32vw"
                compact={assetIndex > 0}
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,transparent_35%,rgba(99,102,241,0.08))]" />
        </div>

        <div className="px-1 pb-1 pt-5">
          <p className="max-w-[42rem] text-sm leading-6 text-white/58">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Platforms">
            {project.platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.13em] text-blue-200/80"
              >
                {platform}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.72rem] text-white/38">
            {project.capabilities.slice(0, 3).map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
            {project.capabilities.length > 3 && (
              <span>+{project.capabilities.length - 3} more</span>
            )}
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-blue-200">
            Explore Case Study
            <ArrowUpRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
