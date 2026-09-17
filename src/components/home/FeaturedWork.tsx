"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { WEB_PROJECTS, AI_PROJECTS, FEATURED_PROJECTS } from "@/data/projects";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import { BrandSystemsSection } from "@/components/work/brand-systems/BrandSystemsSection";
import { ProjectCard } from "./ProjectCard";
import { LapSignalFeature } from "./LapSignalFeature";
import { GradientText, Reveal } from "./Primitives";

type WorkFilter = "featured" | "web" | "ai" | "brand";

const getWorkFilterFromLocation = (): WorkFilter => {
  if (typeof window === "undefined") return "featured";
  const requestedFilter = new URLSearchParams(window.location.search).get(
    "work",
  );
  return requestedFilter === "ai" || requestedFilter === "brand" || requestedFilter === "web"
    ? requestedFilter
    : "featured";
};

const subscribeToWorkLocation = (onStoreChange: () => void) => {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
};

export function FeaturedWork() {
  const locationFilter = useSyncExternalStore(
    subscribeToWorkLocation,
    getWorkFilterFromLocation,
    () => "featured",
  );
  const filter = locationFilter;
  const [showAllProjects, setShowAllProjects] = useState(false);
  const reduceMotion = useReducedMotion();

  const selectFilter = (nextFilter: WorkFilter) => {
    setShowAllProjects(false);
    emitSceneReaction("filter-change", 1);

    const url = new URL(window.location.href);
    url.searchParams.set("work", nextFilter);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const filters: { key: WorkFilter; label: string }[] = [
    { key: "featured", label: "Featured Engineering" },
    { key: "web", label: "Additional Client Work" },
    { key: "ai", label: "AI Labs / Experiments" },
    { key: "brand", label: "Brand / Design" },
  ];

  const filteredProjects =
    filter === "featured" ? FEATURED_PROJECTS : filter === "web" ? WEB_PROJECTS.filter((project) => project.id !== "safe-safar") : filter === "ai" ? AI_PROJECTS : [];
  const visibleProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 6);
  const canToggleProjects = filteredProjects.length > 6;

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-16">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              01 — Featured Engineering Work
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              Software with
              <br />
              <GradientText>evidence.</GradientText>
            </h2>
          </div>
        </Reveal>

        <LapSignalFeature />

        {/* Filter tabs */}
        <Reveal delay={80}>
          <div
            className="flex flex-wrap gap-2.5 mb-14"
            role="tablist"
            aria-label="Work disciplines"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                id={`work-tab-${f.key}`}
                type="button"
                role="tab"
                onClick={() => selectFilter(f.key)}
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    return;
                  }

                  event.preventDefault();
                  const currentIndex = filters.findIndex(
                    (item) => item.key === f.key,
                  );
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? filters.length - 1
                        : (currentIndex +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            filters.length) %
                          filters.length;
                  const nextFilter = filters[nextIndex];
                  selectFilter(nextFilter.key);
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById(`work-tab-${nextFilter.key}`)
                      ?.focus();
                  });
                }}
                aria-selected={filter === f.key}
                aria-controls="work-category-panel"
                tabIndex={filter === f.key ? 0 : -1}
                className="px-5 py-2 rounded-full text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f]"
                style={{
                  background:
                    filter === f.key
                      ? "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))"
                      : "rgba(255,255,255,0.03)",
                  border:
                    filter === f.key
                      ? "1px solid rgba(30,144,255,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                  color: filter === f.key ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Content */}
        <div
          id="work-category-panel"
          role="tabpanel"
          aria-labelledby={`work-tab-${filter}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={filter}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              <p className="mb-8 max-w-3xl text-sm leading-7 text-white/45">
                {filter === "featured" && "Selected product work across interfaces, APIs and applied AI. LapSignal leads the engineering story; these projects show other parts of my work."}
                {filter === "web" && "Client websites and product concepts, with an emphasis on requirements, clear interfaces and delivery. Concept work is identified in each description."}
                {filter === "ai" && "Portfolio prototypes exploring role-based reasoning, staged software generation and structured research. These are learning experiments, not production client AI deployments."}
                {filter === "brand" && "A supporting part of my background: branding, design, content planning, SEO, social media and Meta campaigns. This work informs how I communicate and deliver products."}
              </p>
              {filter !== "brand" ? (
                <>
                  <div
                    id="project-grid"
                    className={`grid grid-cols-1 md:grid-cols-2 ${filter === "featured" ? "" : "lg:grid-cols-3"} gap-5`}
                  >
                    {visibleProjects.map((project, i) => (
                      <Reveal key={project.id} delay={i * 55} className="h-full">
                        <ProjectCard project={project} />
                      </Reveal>
                    ))}
                  </div>

                  {canToggleProjects && (
                    <Reveal delay={120}>
                      <div className="flex justify-center mt-12">
                        <button
                          type="button"
                          onClick={() => setShowAllProjects((current) => !current)}
                          aria-expanded={showAllProjects}
                          aria-controls="project-grid"
                          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm text-white/55 hover:text-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {showAllProjects ? "Show less" : "Show more"}
                          <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className={`transition-transform duration-300 ${
                              showAllProjects ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </Reveal>
                  )}
                </>
              ) : (
                <BrandSystemsSection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
