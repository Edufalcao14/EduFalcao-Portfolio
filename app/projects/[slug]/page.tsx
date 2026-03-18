import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectPageData, ProjectsPageStaticData } from "@/types/ProjectsInfo";
import { ProjectDetails } from "@/components/pages/projects/project-details";
import { ProjectSections } from "@/components/pages/projects/project-sections";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { getProjectDetailQuery, PROJECT_STATIC_PARAMS_QUERY } from "@/lib/queries/projects";

type ProjectProps = {
  params: {
    slug: string;
  };
};

const getProjectDetails = async (slug: string): Promise<ProjectPageData> => {
  return fetchHygraphQuery(getProjectDetailQuery(slug));
};

export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const projectData = await getProjectDetails(params.slug);
  if (!projectData.projectCard) return {}
  return {
    title: projectData.projectCard.projectName,
    description: projectData.projectCard.projectDescription,
  }
}

export default async function Projects({ params: { slug } }: ProjectProps) {
  if (!/^[a-z0-9-]+$/.test(slug)) notFound()

  const projectData = await getProjectDetails(slug);
  if (!projectData.projectCard) notFound()

  return (
    <>
      <ProjectDetails projectCard={projectData.projectCard} />
      <ProjectSections projectCard={projectData.projectCard} />
    </>
  );
}

export async function generateStaticParams() {
  const { projectCards } = await fetchHygraphQuery<ProjectsPageStaticData>(PROJECT_STATIC_PARAMS_QUERY);
  return projectCards;
}
