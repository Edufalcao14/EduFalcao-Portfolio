import { Suspense } from "react"
import type { Metadata } from "next"
import { PageIntroduction } from "@/components/pages/projects/page-introduction"
import { ProjectCard } from "@/components/pages/projects/project-card"
import { HorizontalDivider } from "@/components/divider/horizontal"
import { ProjectsPageData } from "@/types/ProjectsInfo"
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query"
import { PROJECTS_LIST_QUERY } from "@/lib/queries/projects"

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio',
}

async function ProjectsContent() {
  const data = await fetchHygraphQuery<ProjectsPageData>(PROJECTS_LIST_QUERY)
  const projectData = data.project
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
