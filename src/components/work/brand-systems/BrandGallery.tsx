"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type {
  BrandAsset,
  BrandPlatform,
  BrandSection,
} from "@/data/brandSystems";
import { BrandAssetVisual } from "./BrandAssetVisual";

type GalleryFilter = "All" | BrandPlatform;

type BrandGalleryProps = {
  assets: BrandAsset[];
  brandName: string;
  section: BrandSection;
};

const ASPECT_CLASSES: Record<BrandAsset["aspect"], string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

const FILTER_ORDER: BrandPlatform[] = [
  "Instagram",
  "Facebook",
  "Meta Ads",
  "Other",
];

export function BrandGallery({ assets, brandName, section }: BrandGalleryProps) {
  const platforms = useMemo(
    () => FILTER_ORDER.filter((platform) => assets.some((asset) => asset.platform === platform)),
    [assets],
  );
  const [filter, setFilter] = useState<GalleryFilter>("All");
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const filteredAssets = useMemo(
    () =>
      filter === "All"
        ? assets
        : assets.filter((asset) => asset.platform === filter),
    [assets, filter],
  );

  const activeIndex = activeSrc
    ? filteredAssets.findIndex((asset) => asset.src === activeSrc)
    : -1;
  const activeAsset = activeIndex >= 0 ? filteredAssets[activeIndex] : null;

  const closeLightbox = () => {
    setActiveSrc(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const moveLightbox = (direction: -1 | 1) => {
    if (activeIndex < 0 || filteredAssets.length < 2) return;
    const nextIndex =
      (activeIndex + direction + filteredAssets.length) % filteredAssets.length;
    setActiveSrc(filteredAssets[nextIndex].src);
  };

  useEffect(() => {
    if (!activeAsset) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLightbox(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveLightbox(1);
      }
      if (event.key === "Tab" && lightboxRef.current) {
        const focusable = Array.from(
          lightboxRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeAsset, activeIndex, filteredAssets]);

  const selectFilter = (nextFilter: GalleryFilter) => {
    setFilter(nextFilter);
    setActiveSrc(null);
  };

  return (
    <section id="content" aria-labelledby="content-heading" className="scroll-mt-40 py-20 sm:py-28">
      <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-blue-300/65">
            Selected creative output
          </p>
          <h2 id="content-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Content system
          </h2>
        </div>

        <div
          className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.025] p-1"
          aria-label={`${brandName} gallery filters`}
        >
          {(["All", ...platforms] as GalleryFilter[]).map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => selectFilter(platform)}
              aria-pressed={filter === platform}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-400 ${
                filter === platform
                  ? "bg-white/[0.1] text-white"
                  : "text-white/45 hover:text-white/75"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-9 grid gap-5 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.025em] text-white/85">
            {section.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            {section.description}
          </p>
        </div>
        <ul className="flex flex-wrap content-start gap-2">
          {section.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/[0.07] px-3 py-1.5 text-xs text-white/42"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="mb-8 max-w-2xl text-xs leading-5 text-white/32">
        Selected public-facing creative produced for the brand&apos;s social presence.
      </p>

      <div className="brand-gallery columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filteredAssets.map((asset) => (
          <figure
            key={asset.src}
            className="brand-gallery__item mb-4 break-inside-avoid overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-white/[0.025]"
          >
            <button
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setActiveSrc(asset.src);
              }}
              className={`group relative block w-full overflow-hidden bg-[#090a16] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 ${ASPECT_CLASSES[asset.aspect]}`}
              aria-label={`Open ${asset.alt} in the lightbox`}
            >
              <BrandAssetVisual
                asset={asset}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/65 opacity-85 backdrop-blur-sm transition group-hover:border-blue-300/30 group-hover:text-white">
                <Expand size={15} aria-hidden="true" />
              </span>
            </button>
            <figcaption className="flex items-start justify-between gap-4 px-4 py-3.5">
              <span className="text-xs leading-5 text-white/55">{asset.caption}</span>
              <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-blue-200/55">
                {asset.platform} · {asset.format}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {activeAsset && (
        <div
          ref={lightboxRef}
          className="brand-lightbox fixed inset-0 z-[100] flex items-center justify-center bg-[#05050b]/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${brandName} creative lightbox`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            autoFocus
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/75 outline-none transition hover:bg-white/[0.1] hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 sm:right-8 sm:top-8"
            aria-label="Close lightbox"
          >
            <X size={18} aria-hidden="true" />
          </button>

          {filteredAssets.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => moveLightbox(-1)}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/75 outline-none transition hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 sm:left-8"
                aria-label="Previous creative"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveLightbox(1)}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/75 outline-none transition hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 sm:right-8"
                aria-label="Next creative"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}

          <figure className="w-full max-w-5xl" aria-live="polite">
            <div
              className={`relative mx-auto max-h-[72vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#090a16] ${ASPECT_CLASSES[activeAsset.aspect]}`}
            >
              <BrandAssetVisual
                asset={activeAsset}
                sizes="(max-width: 1024px) 92vw, 1024px"
              />
            </div>
            <figcaption className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-white/65">{activeAsset.caption}</span>
              <span className="text-xs uppercase tracking-[0.16em] text-blue-200/60">
                {activeAsset.platform} · {activeAsset.format} · {activeIndex + 1}/{filteredAssets.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
