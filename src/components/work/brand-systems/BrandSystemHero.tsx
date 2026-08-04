import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Facebook, Instagram } from "lucide-react";
import type { BrandSystemProject } from "@/data/brandSystems";
import { BrandAssetVisual } from "./BrandAssetVisual";

export function BrandSystemHero({ project }: { project: BrandSystemProject }) {
  const previewAssets = project.gallery.slice(0, 4);

  return (
    <header className="relative overflow-hidden border-b border-white/[0.08]">
      <div className="brand-case-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 lg:px-10">
        <nav className="mb-16 flex items-center sm:mb-24" aria-label="Case study navigation">
          <Link
            href="/?work=brand#work"
            className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm text-white/55 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Brand &amp; Marketing
          </Link>
        </nav>

        <div className="grid items-end gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="brand-system-enter">
            <div className="mb-6 flex items-center gap-4">
              <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-xl shadow-black/20">
                <Image
                  src={project.logo.src}
                  alt={project.logo.alt}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                  priority
                />
              </span>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-blue-300/65">
                {project.industry}
              </p>
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.065em] text-white sm:text-7xl lg:text-[5.6rem]">
              {project.name}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/56 sm:text-lg sm:leading-8">
              {project.summary}
            </p>
            <p className="mt-5 max-w-xl border-l border-purple-300/30 pl-4 text-sm italic leading-6 text-purple-100/65">
              {project.positioning}
            </p>

            <div className="mt-8 flex flex-wrap gap-2" aria-label="Platforms">
              {project.platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-blue-200/80"
                >
                  {platform}
                </span>
              ))}
            </div>

            <div className="mt-4 flex max-w-xl flex-wrap gap-x-4 gap-y-2 text-xs text-white/40">
              {project.capabilities.map((capability) => (
                <span key={capability}>{capability}</span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/65 outline-none transition hover:border-blue-300/25 hover:text-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Also view the website build
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
              <a
                href={project.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/65 outline-none transition hover:border-purple-300/25 hover:text-purple-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label={`View ${project.name} on Instagram`}
              >
                <Instagram size={14} aria-hidden="true" />
                Instagram
              </a>
              <a
                href={project.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/65 outline-none transition hover:border-blue-300/25 hover:text-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label={`View ${project.name} on Facebook`}
              >
                <Facebook size={14} aria-hidden="true" />
                Facebook
              </a>
            </div>
          </div>

          <div className="brand-hero-composition brand-system-enter relative h-[29rem] sm:h-[36rem]" style={{ animationDelay: "80ms" }}>
            {previewAssets.map((asset, index) => (
              <div
                key={asset.src}
                className={`brand-hero-composition__panel brand-hero-composition__panel--${index + 1} absolute overflow-hidden rounded-[1.3rem] border border-white/[0.11] bg-[#090a16] shadow-2xl shadow-black/25`}
              >
                <BrandAssetVisual
                  asset={asset}
                  sizes="(max-width: 1024px) 55vw, 30vw"
                  priority={index === 0}
                  compact={index > 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
