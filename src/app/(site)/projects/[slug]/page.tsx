import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetails } from "@/components/pages/projects/project-details"
import { ProjectSections } from "@/components/pages/projects/project-sections"
import { CaseBody } from "@/components/pages/projects/case-body"
import { getProjectCard } from "@/lib/content"

/**
 * Rendered on demand, not at build time.
 *
 * This page used to prerender every slug through generateStaticParams, which
 * queried Postgres while the Docker image was being built. A build container has
 * no database, so the whole deploy failed on ECONNREFUSED. Reads are cached in
 * src/lib/content.ts and purged when something is published, so serving these
 * per request costs a render, not a query.
 */
export const dynamic = 'force-dynamic'

// Next 16 hands params in as a promise, so it has to be awaited.
type ProjectProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const { slug } = await params
  const projectCard = await getProjectCard(slug)
  if (!projectCard) return {}
  return {
    title: projectCard.projectName,
    description: projectCard.projectDescription,
    openGraph: {
      title: projectCard.projectName,
      description: projectCard.projectDescription,
      type: 'article',
      ...(projectCard.thumbPhoto.url ? { images: [{ url: projectCard.thumbPhoto.url }] } : {}),
    },
  }
}

export default async function Project({ params }: ProjectProps) {
  const { slug } = await params

  if (!/^[a-z0-9-]+$/.test(slug)) notFound()

  const projectCard = await getProjectCard(slug)
  if (!projectCard) notFound()

  return (
    <>
      <ProjectDetails projectCard={projectCard} />
      <CaseBody projectCard={projectCard} />
      <ProjectSections projectCard={projectCard} />
    </>
  )
}
