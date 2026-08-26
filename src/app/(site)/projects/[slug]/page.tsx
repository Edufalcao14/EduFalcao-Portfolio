import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HiArrowNarrowLeft } from "react-icons/hi"

import { Link } from "@/components/Link"
import { ProjectDetails } from "@/components/pages/projects/project-details"
import { CaseWalkthrough } from "@/components/pages/projects/case-walkthrough"
import { CaseSummary } from "@/components/pages/projects/case-summary"
import { CaseBody } from "@/components/pages/projects/case-body"
import { getProjectCard } from "@/lib/content"
import type { ProjectCardType } from "@/types/ProjectsInfo"
import { toMetaDescription } from "@/lib/meta"

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

/**
 * The Open Graph media for a case, picked by kind.
 *
 * A crawler needs a still to draw the card with, so a video thumbnail is
 * published as `videos` and the still is borrowed from the first image in the
 * walkthrough. A project with no still at all simply has no preview image,
 * which is better than a preview that fails to load.
 */
const ogMedia = (project: ProjectCardType) => {
  const firstStill = project.projectSection
    .flatMap((section) => section.image)
    .find((media) => media.url && !media.mimeType?.startsWith('video/'))

  if (project.thumbPhoto.mimeType?.startsWith('video/')) {
    return {
      videos: [{ url: project.thumbPhoto.url }],
      ...(firstStill ? { images: [{ url: firstStill.url }] } : {}),
    }
  }

  return project.thumbPhoto.url ? { images: [{ url: project.thumbPhoto.url }] } : {}
}

export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const { slug } = await params
  const projectCard = await getProjectCard(slug)
  if (!projectCard) return {}
  // The summary can run to several paragraphs on the page; a search result
  // cannot, so it is trimmed to whole sentences here.
  const description = toMetaDescription(projectCard.projectDescription)

  return {
    title: projectCard.projectName,
    description,
    openGraph: {
      title: projectCard.projectName,
      description,
      type: 'article',
      // The thumbnail may be a video, and an mp4 in `images` gives every social
      // card a broken preview. A video goes in `videos`, and the preview image
      // falls back to the first still in the walkthrough.
      ...ogMedia(projectCard),
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
      <CaseSummary text={projectCard.projectDescription} />
      <CaseBody projectCard={projectCard} />
      <CaseWalkthrough projectCard={projectCard} />
      <div className="container mb-20 border-t border-gray-800 pt-8">
        <Link href="/projects">
          <HiArrowNarrowLeft size={18} />
          Go back to projects
        </Link>
      </div>
    </>
  )
}
