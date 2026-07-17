import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { crewProjects, getCrewProject } from "@/lib/crews/projects";

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
    title: project.name,
    description: project.description,
  };
}

export default async function AgentSystemPage({ params }: Params) {
  const { projectId } = await params;
  const project = getCrewProject(projectId);
  if (!project) notFound();

  return <CrewLab project={project} projects={crewProjects} />;
}
