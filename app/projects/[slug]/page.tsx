import { ProjectCardType, ProjectPageData, ProjectspageStaticData } from "@/app/types/projectsInfo";
import { ProjectDetails } from "@/components/pages/projects/project-details"
import { ProjecSections } from "@/components/pages/projects/project-sections"
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";

type ProjectProps = {
    params: {
        slug: string
    }
}

const getProjectDetails = async (slug: string): Promise<ProjectCardType> => {
    const query = `
 query MyQuery {
  projectCard(where: { slug: "${slug}" }) {  
   slug
    projectName
    projectDescription
    githubUrl
    liveUrl
    thumbPhoto {
      url
    }
    projectSection {
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

  `;
    return await fetchHygraphQuery(query);
};


export default async function Projects({ params: { slug } }: ProjectProps) {
    const projectData = await getProjectDetails(slug);
    return (
        <>
            <ProjectDetails projectInfo={projectData} />
            <ProjecSections projectInfo={projectData} />
        </>
    )
};

export async function generateStaticParams() {
    const querry = `
 query Projets {
  projectCards(first:100){
    slug
  }
}
     `;

     const { projectCards } = await fetchHygraphQuery<ProjectspageStaticData>(querry);

     return projectCards;
}
