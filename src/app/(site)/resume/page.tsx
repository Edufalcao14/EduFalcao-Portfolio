import { Suspense } from "react"
import type { Metadata } from "next"
import { Resume } from "@/components/pages/resume/tabAboutMe"
import { WorkExperience } from "@/components/pages/resume/workExperience/index"
import { getExperienceInfo, getResumeInfo, getSettings } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: 'Resume',
    description: settings.defaultDescription,
  }
}

async function ResumeContent() {
  const [resumeInfo, experienceInfo] = await Promise.all([getResumeInfo(), getExperienceInfo()])
  return (
    <>
      <Resume resumeInfo={resumeInfo} />
      <WorkExperience experienceInfo={experienceInfo} />
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
