
import React from "react";
import { PageIntroduction } from "@/components/pages/projects/page-introduction";
import { ProjectCard } from "@/components/pages/projects/project-card";
import { HorizontalDivider } from "@/components/divider/horizontal";
import { ProjectsPageData } from "@/types/ProjectsInfo";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import ParticlesContainer from "@/components/ParticlesContainer";

export const metadata = {
    title: 'Projects',
    description: 'Portfolio',
};


const getPageData = async (): Promise<ProjectsPageData> => {
    const query = `
  query MyQuery {
  project(where: {slug: "projects"}) {
    mainText
    projectCard{
      slug
      projectName
      projectDescription
      githubUrl
      liveUrl
      thumbPhoto{
        url
      }
      projectSection{
        title
        image{
          url
        }
      }
      technology {
        name
      }
    }
     
  }
}
  `;
    return await fetchHygraphQuery(query);
};


export default async function Projects() {
    const { project: projectData } = await getPageData();
    return (
        <section className=" bg-hero-image bg-cover bg-center bg-no-repeat pb-10">
            <PageIntroduction mainText={projectData.mainText} />
            <div className=" container mt-6">
                {projectData.projectCard.map((project, index) => (
                    <div key={index}>
                        <ProjectCard project={project} />
                        <HorizontalDivider className="my-16" />
                    </div>
                ))}
            </div>
            <ParticlesContainer />
        </section>
    );
}

