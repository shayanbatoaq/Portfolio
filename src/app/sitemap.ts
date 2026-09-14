import type { MetadataRoute } from "next";
import { BRAND_SYSTEMS } from "@/data/brandSystems";
import { lapsignal } from "@/data/lapsignal";
import { crewProjects } from "@/lib/crews/projects";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...crewProjects.map((project) => ({
      url: absoluteUrl(`/work/ai/${project.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl(lapsignal.href),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...BRAND_SYSTEMS.map((project) => ({
      url: absoluteUrl(`/work/brand-systems/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
