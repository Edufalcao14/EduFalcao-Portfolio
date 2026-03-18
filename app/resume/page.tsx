import { Suspense } from "react"
import type { Metadata } from "next"
import { Resume } from "@/components/pages/resume/tabAboutMe"
import { WorkExperience } from "@/components/pages/resume/workExperience/index"
import { ResumePageData } from "@/types/ResumePageInfo"
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query"
import { ExperiencePageData } from "@/types/WorkExperiencesInfo"
import { RESUME_QUERY, EXPERIENCE_QUERY } from "@/lib/queries/resume"

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Portfolio',
}

async function ResumeContent() {
  const [resumeData, experienceData] = await Promise.all([
    fetchHygraphQuery<ResumePageData>(RESUME_QUERY),
    fetchHygraphQuery<ExperiencePageData>(EXPERIENCE_QUERY),
  ])
  return (
    <>
      <Resume resumeInfo={resumeData.resumePage} />
      <WorkExperience experienceInfo={experienceData.professionalExperience} />
    </>
  )
}

export default function ResumePage() {
  return (
    <section className="bg-hero-image bg-cover bg-center bg-no-repeat">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ResumeContent />
      </Suspense>
    </section>
  )
}
