import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandSystemCaseStudy } from "@/components/work/brand-systems/BrandSystemCaseStudy";
import { BRAND_SYSTEMS, getBrandSystem } from "@/data/brandSystems";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return BRAND_SYSTEMS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getBrandSystem(slug);

  if (!project) return {};

  return {
    title: `${project.name} Digital Growth Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.name} Digital Growth Case Study | Shayan Batoaq`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function BrandSystemPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getBrandSystem(slug);

  if (!project) notFound();

  return <BrandSystemCaseStudy project={project} />;
}
