import React from "react";
import type { Metadata } from "next";
import { PageIntroduction } from "@/components/pages/projects/page-introduction";
import { ProjectCard } from "@/components/pages/projects/project-card";
import { HorizontalDivider } from "@/components/divider/horizontal";
import { ProjectsPageData } from "@/types/ProjectsInfo";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { PROJECTS_LIST_QUERY } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio',
};

const getPageData = async (): Promise<ProjectsPageData> => {
  return fetchHygraphQuery(PROJECTS_LIST_QUERY);
};

export default async function Projects() {
  const { project: projectData } = await getPageData();
  return (
    <section className=" bg-hero-image bg-cover bg-center bg-no-repeat pb-10">
      <PageIntroduction mainText={projectData.mainText} />
      <div className=" container mt-6">
        {projectData.projectCard.map((project) => (
          <div key={project.slug}>
            <ProjectCard project={project} />
            <HorizontalDivider className="my-16" />
          </div>
        ))}
      </div>
    </section>
  );
}
