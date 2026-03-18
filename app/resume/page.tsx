import type { Metadata } from "next";
import { Resume } from "@/components/pages/resume/tabAboutMe";
import { WorkExperience } from "@/components/pages/resume/workExperience/index";
import { ResumePageData } from "@/types/ResumePageInfo";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { ExperiencePageData } from "@/types/WorkExperiencesInfo";
import { RESUME_QUERY, EXPERIENCE_QUERY } from "@/lib/queries/resume";

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Portfolio',
};

const getPageData = async (): Promise<ResumePageData> => {
  return fetchHygraphQuery(RESUME_QUERY);
};

const getExperiencePageData = async (): Promise<ExperiencePageData> => {
  return fetchHygraphQuery(EXPERIENCE_QUERY);
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
