import { Suspense } from "react"
import type { Metadata } from "next"
import { WorkExperience } from "@/components/pages/resume/workExperience"
import { Skills } from "@/components/pages/resume/skills"
import { Summary } from "@/components/pages/resume/summary"
import { Education } from "@/components/pages/resume/education"
import { getExperienceInfo, getResumeInfo, getSettings } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: 'Resume',
    description: settings.defaultDescription,
  }
}

/**
 * Section order is the argument this page makes: experience first, then the
 * stack that backs it, then the summary, then formal education last. The tabs
 * this page used to have put all three behind a click and led with "About Me",
 * which buried the only section a recruiter came for.
 */
async function ResumeContent() {
  const [resumeInfo, experienceInfo] = await Promise.all([getResumeInfo(), getExperienceInfo()])

  return (
    <>
      <WorkExperience experienceInfo={experienceInfo} />
      <Skills skill={resumeInfo.skill} />
      <Summary aboutMe={resumeInfo.aboutMe} />
      <Education education={resumeInfo.education} />
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
