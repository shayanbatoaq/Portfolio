import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BrandSystemProject } from "@/data/brandSystems";
import { BrandGallery } from "./BrandGallery";
import { BrandIdentityPanel } from "./BrandIdentityPanel";
import { BrandReflection } from "./BrandReflection";
import { BrandSystemHero } from "./BrandSystemHero";
import { CampaignWorkspace } from "./CampaignWorkspace";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";

export function BrandSystemCaseStudy({ project }: { project: BrandSystemProject }) {
  const sections = [
    { href: "#identity", label: "Identity" },
    { href: "#content", label: "Content" },
    ...(project.campaigns?.length
      ? [{ href: "#campaigns", label: "Campaigns" }]
      : []),
    { href: "#reflection", label: "Reflection" },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#07070f] text-white selection:bg-blue-400/25">
      <PortfolioNav />
      <BrandSystemHero project={project} />

      <nav
        className="brand-case-nav sticky top-[5.25rem] z-40 border-y border-white/[0.08] bg-[#07070f]/88 backdrop-blur-xl"
        aria-label="Case study sections"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-2 sm:px-8 lg:px-10">
          {sections.map((section, index) => (
            <a
              key={section.href}
              href={section.href}
              className="shrink-0 rounded-full px-3.5 py-2 text-xs font-medium text-white/45 outline-none transition hover:bg-white/[0.05] hover:text-white/80 focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="mr-2 text-white/20" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <BrandIdentityPanel project={project} />
        <BrandGallery
          assets={project.gallery}
          brandName={project.name}
          section={project.sections.content}
        />
        {project.campaigns?.length ? (
          <CampaignWorkspace campaigns={project.campaigns} />
        ) : null}
        <BrandReflection reflection={project.reflection} />

        <footer className="border-t border-white/[0.08] py-12 sm:py-16">
          <Link
            href="/?work=brand#work"
            className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm text-white/52 outline-none transition hover:text-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Return to Digital Growth
          </Link>
        </footer>
      </div>
    </main>
  );
}
