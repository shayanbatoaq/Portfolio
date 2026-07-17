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
    title: `${project.name} — Agentic AI System`,
    description: project.description,
    alternates: {
      canonical: `/work/ai/${project.id}`,
    },
    openGraph: {
      title: `${project.name} — Agentic AI System by Shayan Batoaq`,
      description: project.description,
      url: absoluteUrl(`/work/ai/${project.id}`),
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1728,
          height: 910,
          alt: "Shayan Batoaq — AI Engineer and Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Agentic AI System`,
      description: project.description,
      images: ["/og.png"],
    },
  };
}

export default async function AgentSystemPage({ params }: Params) {
  const { projectId } = await params;
  const project = getCrewProject(projectId);
  if (!project) notFound();

  return <CrewLab project={project} projects={crewProjects} />;
}
