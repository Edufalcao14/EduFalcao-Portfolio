import { Suspense } from "react"
import type { Metadata } from "next"
import { PageIntroduction } from "@/components/pages/projects/page-introduction"
import { ProjectCard } from "@/components/pages/projects/project-card"
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
      {/* One rule per card, drawn by the card itself, and a closing rule under
          the last one. The old divider sat between cards with `my-16` on both
          sides, which put 128px of nothing between every project. */}
      <ul className="container mt-6 border-b border-gray-800">
        {projectData.projectCard.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
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
