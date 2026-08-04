import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandSystemCaseStudy } from "@/components/work/brand-systems/BrandSystemCaseStudy";
import { BRAND_SYSTEMS, getBrandSystem } from "@/data/brandSystems";
import { absoluteUrl } from "@/lib/seo";

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

  const path = `/work/brand-systems/${project.slug}`;
  const socialImage = project.gallery.find((asset) => asset.available)?.src ?? "/og.png";

  return {
    title: `${project.name} — Brand & Marketing`,
    description: project.summary,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${project.name} Brand & Marketing Case Study | Shayan Batoaq`,
      description: project.summary,
      type: "article",
      url: absoluteUrl(path),
      images: [
        {
          url: socialImage,
          alt: `${project.name} brand and marketing work by Shayan Batoaq`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Brand & Marketing`,
      description: project.summary,
      images: [socialImage],
    },
  };
}

export default async function BrandSystemPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getBrandSystem(slug);

  if (!project) notFound();

  return <BrandSystemCaseStudy project={project} />;
}
