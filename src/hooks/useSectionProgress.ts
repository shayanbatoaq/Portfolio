"use client";

import { useEffect, useRef } from "react";

import {
  PAGE_SECTION_IDS,
  type PageSectionId,
} from "@/lib/three/sceneStates";

export interface SectionProgressSnapshot {
  current: PageSectionId;
  next: PageSectionId;
  index: number;
  progress: number;
  velocity: number;
  direction: -1 | 0 | 1;
}

const INITIAL_SNAPSHOT: SectionProgressSnapshot = {
  current: "home",
  next: "about",
  index: 0,
  progress: 0,
  velocity: 0,
  direction: 0,
};

export function useSectionProgress(reducedMotion: boolean) {
  const snapshotRef = useRef<SectionProgressSnapshot>({
    ...INITIAL_SNAPSHOT,
  });

  useEffect(() => {
    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    let lastTime = performance.now();

    const measure = () => {
      frame = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const anchor = viewportHeight * 0.56;
      const sections = PAGE_SECTION_IDS.map((id) =>
        document.getElementById(id)
      ).filter((section): section is HTMLElement => Boolean(section));

      if (!sections.length) return;

      let activeIndex = 0;
      for (let index = 0; index < sections.length; index += 1) {
        if (sections[index].getBoundingClientRect().top <= anchor) {
          activeIndex = index;
        }
      }

      const active = sections[activeIndex];
      const rect = active.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (anchor - rect.top) / Math.max(rect.height, 1))
      );
      const sectionId =
        (active.id as PageSectionId) ?? PAGE_SECTION_IDS[activeIndex];
      const nextId =
        PAGE_SECTION_IDS[
          Math.min(
            PAGE_SECTION_IDS.indexOf(sectionId) + 1,
            PAGE_SECTION_IDS.length - 1
          )
        ];

      snapshotRef.current.current = sectionId;
      snapshotRef.current.next = nextId;
      snapshotRef.current.index = PAGE_SECTION_IDS.indexOf(sectionId);
      snapshotRef.current.progress = progress;
    };

    const requestMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      const elapsed = Math.max(now - lastTime, 8);
      const normalizedVelocity = reducedMotion
        ? 0
        : Math.max(-1.5, Math.min(1.5, delta / elapsed));

      snapshotRef.current.velocity = normalizedVelocity;
      snapshotRef.current.direction =
        delta === 0 ? 0 : delta > 0 ? 1 : -1;
      lastY = currentY;
      lastTime = now;
      requestMeasure();

      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        snapshotRef.current.velocity = 0;
        snapshotRef.current.direction = 0;
      }, 120);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (settleTimer) clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [reducedMotion]);

  return snapshotRef;
}
