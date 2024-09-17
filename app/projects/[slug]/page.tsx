import { ProjectPageData, ProjectsPageStaticData } from "@/types/ProjectsInfo";
import { ProjectDetails } from "@/components/pages/projects/project-details";
import { ProjectSections } from "@/components/pages/projects/project-sections";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";

type ProjectProps = {
  params: {
    slug: string;
  };
};

const getProjectDetails = async (slug: string): Promise<ProjectPageData> => {
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
          image {
            url
          }
        }
        technology {
          name
        }
      }
    }
  `;
  return fetchHygraphQuery(query, 1000 * 60 * 60 * 24);
};

export default async function Projects({ params: { slug } }: ProjectProps) {
  const projectData = await getProjectDetails(slug);
  console.log(projectData.projectCard);
  return (
    <>
      <ProjectDetails projectCard={projectData.projectCard} />
      <ProjectSections projectCard={projectData.projectCard} /> 
    </>
  );
}
export async function generateStaticParams() {
  const query = `
   query {
  projectCards(first: 100) {
    slug
  }
}
  `
  const { projectCards } = await fetchHygraphQuery<ProjectsPageStaticData>(query)

  return projectCards
}