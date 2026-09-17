import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { crewProjects, getCrewProject } from "@/lib/crews/projects";
import { absoluteUrl } from "@/lib/seo";

import CrewLab from "./CrewLab";

type Params = {
  params: Promise<{ projectId: string }>;
};

export function generateStaticParams() {
  return crewProjects.map((project) => ({ projectId: project.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { projectId } = await params;
  const project = getCrewProject(projectId);
  if (!project) return {};

  return {
    title: `${project.name} — AI Workflow Prototype`,
    description: project.description,
    alternates: {
      canonical: `/work/ai/${project.id}`,
    },
    openGraph: {
      title: `${project.name} — AI Workflow Prototype by Shayan Batoaq`,
      description: project.description,
      url: absoluteUrl(`/work/ai/${project.id}`),
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Shayan Batoaq — Full-Stack & AI Product Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — AI Workflow Prototype`,
      description: project.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function AgentSystemPage({ params }: Params) {
  const { projectId } = await params;
  const project = getCrewProject(projectId);
  if (!project) notFound();

  return <CrewLab project={project} projects={crewProjects} />;
}
