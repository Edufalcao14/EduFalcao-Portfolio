import { Suspense } from "react"
import type { Metadata } from "next"
import { PageIntroduction } from "@/components/pages/projects/page-introduction"
import { ProjectCard } from "@/components/pages/projects/project-card"
import { HorizontalDivider } from "@/components/divider/horizontal"
import { getProjectsPageInfo, getSettings } from "@/lib/content"

// Rendered per request: the build container has no database to prerender from.
// Data is cached in src/lib/content.ts and purged on publish.
export const dynamic = 'force-dynamic'

// Its own description, from the CMS. All four pages used to ship "Portfolio".
export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getProjectsPageInfo(), getSettings()])
  return {
    title: 'Projects',
    description: page.mainText || settings.defaultDescription,
  }
}

async function ProjectsContent() {
  const projectData = await getProjectsPageInfo()
  return (
    <>
      <PageIntroduction mainText={projectData.mainText} />
      <div className="container mt-6">
        {projectData.projectCard.map((project) => (
          <div key={project.slug}>
            <ProjectCard project={project} />
            <HorizontalDivider className="my-16" />
          </div>
        ))}
      </div>
    </>
  )
}

export default function Projects() {
  return (
    <section className="bg-hero-image bg-cover bg-center bg-no-repeat pb-10">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProjectsContent />
      </Suspense>
    </section>
  )
}
