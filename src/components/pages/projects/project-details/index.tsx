import { TbBrandGithub } from "react-icons/tb"
import { FiGlobe } from "react-icons/fi"
import { SiAppstore, SiGoogleplay } from "react-icons/si"
import type { IconType } from "react-icons"

import { Button } from "@/components/button"
import { SlideInView } from "@/components/UI/slide-in-view"
import { ProjectMedia, isVideo } from "@/components/UI/project-media"
import { StackRail } from "@/components/pages/projects/case-stack"
import type { Metric, ProjectCardType } from "@/types/ProjectsInfo"

interface ProjectDetailsProps {
    projectCard: ProjectCardType;
}

/**
 * The case header: what the project is, who built it, and the numbers.
 *
 * Rewritten away from a centred stack over a full-bleed screenshot. Three things
 * were wrong with that and all three were structural rather than cosmetic:
 *
 * - The header is `fixed h-24`, and the hero's `py-24` matched it exactly, so
 *   the title sat under the nav. There is real clearance now.
 * - The thumbnail was painted across the whole section at cover size, so every
 *   piece of text competed with a dashboard screenshot. It is a framed panel
 *   beside the title instead, at the size it was actually generated for.
 * - Everything was centred. Centred layouts need enough content to justify the
 *   symmetry, and this screen renders every project: a one-line academic entry
 *   and a five-paragraph product case cannot both be centred and both read.
 *
 * Every block below the title is driven by a field and disappears when that
 * field is empty, because the thin project has to hold as well as this one.
 */

type Fact = { label: string; value: string; accent?: boolean }

/**
 * Who built it and for whom, and nothing else.
 *
 * The rail used to carry the period and the kind as well. Neither earned its
 * quarter of a full-width row: "Web" restates what the screenshots already show,
 * and a start date tells a reader nothing they came here to learn. The stack
 * takes that space instead, which is the thing a reader actually reaches for
 * after the role.
 */
const buildFacts = (project: ProjectCardType): Fact[] =>
    [
        project.role ? { label: 'Role', value: project.role } : null,
        project.company ? { label: 'Company', value: project.company } : null,
    ].filter((fact): fact is Fact => fact !== null)

type LinkSpec = { href: string; label: string; icon: IconType; primary?: boolean }

const buildLinks = (project: ProjectCardType): LinkSpec[] =>
    [
        project.liveUrl && !project.appStoreUrl && !project.playStoreUrl
            ? { href: project.liveUrl, label: 'Live site', icon: FiGlobe, primary: true }
            : null,
        project.appStoreUrl
            ? { href: project.appStoreUrl, label: 'App Store', icon: SiAppstore, primary: true }
            : null,
        project.playStoreUrl
            ? { href: project.playStoreUrl, label: 'Play Store', icon: SiGoogleplay, primary: true }
            : null,
        project.githubUrl
            ? { href: project.githubUrl, label: 'Repository', icon: TbBrandGithub }
            : null,
    ].filter((link): link is LinkSpec => link !== null)

/** The first paragraph of the summary. The rest is its own block further down. */
const ledeOf = (text: string): string => {
    const [first] = text.split(/\n\s*\n/)
    return (first ?? text).trim().replace(/\s*\n\s*/g, ' ')
}

const MetricBand = ({ metrics }: { metrics: Metric[] }) => (
    <dl className="mt-10 grid grid-cols-1 border-t border-gray-800 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
            <div
                key={metric.label}
                className="border-b border-gray-800 px-0 py-5 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
                <dd className="font-mono text-3xl font-medium tracking-tight text-emerald-400 sm:text-[2rem]">
                    {metric.value}
                </dd>
                <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    {metric.label}
                </dt>
                {/* The method is not decoration. A number that cannot say how it
                    was measured does not get published, and the CMS enforces it. */}
                <p className="mt-2 max-w-[34ch] text-xs leading-relaxed text-gray-500">
                    {metric.method}
                </p>
            </div>
        ))}
    </dl>
)

export const ProjectDetails = ({ projectCard }: ProjectDetailsProps) => {
    const facts = buildFacts(projectCard)
    const links = buildLinks(projectCard)
    const metrics = projectCard.metrics ?? []

    return (
        <SlideInView>
            {/* pt clears the fixed h-24 header with room to spare. */}
            <section className="relative overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-44">
                {/* Atmosphere without an image fighting the type: one emerald wash,
                    the same accent the buttons and badges glow with. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]"
                />

                <div className="container">
                    <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
                        <div>
                            <span className="font-mono text-sm text-emerald-400">.../projects</span>

                            <h1 className="mt-4 font-mono text-4xl font-medium leading-[1.05] tracking-tight text-gray-100 sm:text-5xl lg:text-6xl">
                                {projectCard.projectName}
                            </h1>

                            <div
                                aria-hidden
                                className="mt-6 h-px w-full bg-gradient-to-r from-emerald-500/60 via-emerald-500/20 to-transparent"
                            />

                            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-gray-400 sm:text-lg">
                                {ledeOf(projectCard.projectDescription)}
                            </p>

                            {links.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {links.map(({ href, label, icon: Icon, primary }) => (
                                        <a
                                            key={href}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                                        >
                                            {primary ? (
                                                <Button className="min-w-[164px]">
                                                    <Icon size={19} />
                                                    {label}
                                                </Button>
                                            ) : (
                                                <span className="flex min-h-[44px] min-w-[164px] items-center justify-center gap-2 rounded-md border border-gray-700 px-5 font-mono text-sm text-gray-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-400">
                                                    <Icon size={19} />
                                                    {label}
                                                </span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* The thumbnail at the size it was generated for, framed
                            rather than stretched behind the text. */}
                        {projectCard.thumbPhoto.url && (
                            <figure className="border border-gray-800 bg-gray-900/60 p-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
                                <ProjectMedia
                                    media={projectCard.thumbPhoto}
                                    alt={`${projectCard.projectName} interface`}
                                    width={960}
                                    height={600}
                                    priority
                                    className={
                                        isVideo(projectCard.thumbPhoto)
                                            ? 'aspect-video w-full bg-gray-900 object-contain'
                                            : 'h-auto w-full object-cover'
                                    }
                                />
                            </figure>
                        )}
                    </div>

                    {facts.length > 0 && (
                        <dl className="mt-12 grid grid-cols-2 border-t border-gray-800">
                            {facts.map((fact) => (
                                <div
                                    key={fact.label}
                                    className="border-b border-gray-800 py-4 pr-5 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                                >
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                                        {fact.label}
                                    </dt>
                                    <dd className="mt-2 text-sm text-gray-200 sm:text-base">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {/* Directly after the facts, not in a section of its own
                        further down the page. */}
                    <div className="mt-10">
                        <StackRail technologies={projectCard.technology} />
                    </div>

                    {metrics.length > 0 && <MetricBand metrics={metrics} />}
                </div>
            </section>
        </SlideInView>
    )
}
