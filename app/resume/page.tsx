import { Resume } from "@/components/pages/resume/tabAboutMe";
import { WorkExperience } from "@/components/pages/resume/workExperience/index";
import { ResumePageData } from "../types/ResumePageInfo";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { ExperiencePageData } from "../types/WorkExperiencesInfo";

export const metadata = {
  title: 'Resume',
  description: 'Portfolio',
};

const getPageData = async (): Promise<ResumePageData> => {
  const query = `
query MyQuery {
        resumePage(where: {slug: "resumepage"}) {
           education{
            educationText
            educationCard{
              institution
              degree
              startDate
              endDate
              amountHours
            }
          } 
        aboutMe{
          aboutmeText{
            raw
          }
          email
          socialsAboutMe{
            name
            iconSvg
            url
          }
        }
    	skill{
        skillText
        skillCard{
          name
          skillIcon
        }
      }
    }
}
`;
  return await fetchHygraphQuery(query);
};

const getExperiencePageData = async (): Promise<ExperiencePageData> => {
  const queryExecution = `
query MyQuery {
  professionalExperience(where: {slug: "experiences"}) {
    mainText
    experienceItem {
      projectName
      title
      startDate
      endDate
      experienceText
      technology {
        name
      }
    }
  }
}
`;
console.log()
  return await fetchHygraphQuery(queryExecution);
};



export default async function ResumePage() {
  const { resumePage: pageData } = await getPageData();
  const { professionalExperience: experienceData } = await getExperiencePageData();
  return (
    <section className="bg-hero-image bg-cover bg-center bg-no-repeat">
      <Resume resumeInfo={pageData} />
      <WorkExperience experienceInfo={experienceData} />
    </section>
  );
}
