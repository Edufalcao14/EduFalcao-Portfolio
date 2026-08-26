import Link from "next/link"

import { SlideInView } from "@/components/UI/slide-in-view"
import { ProjectMedia, isVideo } from "@/components/UI/project-media"
import { firstSentence, formatPeriod } from "@/lib/format"
import type { ProjectCardType } from "@/types/ProjectsInfo"

type ProjectCardProps = {
    project: ProjectCardType
}

/**
 * One project in the list: the proof card.
 *
 * What the old card got wrong, in the order it mattered:
 *
 * - Every technology was printed as a filled emerald pill. Eighteen of them ran
 *   six rows deep and took more height than the title, the description and the
 *   link together, while being the least informative thing on the card. Capped
 *   at five now, with a count for the rest.
 * - The screenshot was rendered at roughly 300px, so a dense dashboard was
 *   unreadable and worked as decoration. The media leads at 16:10 instead, and
 *   plays if it is a video.
 * - The whole summary was printed, five paragraphs included. One sentence now.
 * - The metrics never appeared in the list at all, so the strongest thing about
 *   a project stayed hidden behind a click. Up to three sit under the sentence.
 * - Only the words at the bottom were clickable. The whole card is one link.
 *
 * Every block is fed by a field and vanishes when empty: a project with no
 * media, no metrics and two technologies renders a title, a sentence and two
 * chips, and still looks deliberate. That matters more than how this reads with
 * Deentz in it, because most entries will be the thin kind.
 */

const MAX_METRICS = 3
const MAX_CHIPS = 5

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const period = formatPeriod(project.periodStart, project.periodEnd)
    const meta = [project.role, period].filter(Boolean).join(' · ')
    const technologies = project.technology ?? []
    const shownChips = technologies.slice(0, MAX_CHIPS)
    const hiddenChips = technologies.length - shownChips.length
    const metrics = (project.metrics ?? []).slice(0, MAX_METRICS)

    return (
        <SlideInView>
            <Link
                href={`/projects/${project.slug}`}
                // One target for the whole card. Nothing inside it may be a link
                // or a button: nested interactive elements are invalid markup and
                // break keyboard navigation.
                className="group grid gap-6 border-t border-gray-800 py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10"
            >
                <div>
                    {project.thumbPhoto?.url ? (
                        <ProjectMedia
                            media={project.thumbPhoto}
                            alt={`${project.projectName} interface`}
                            width={840}
                            height={525}
                            mode="poster"
                            className={
                                isVideo(project.thumbPhoto)
                                    ? 'aspect-[16/10] w-full rounded-lg border border-gray-800 bg-gray-900 object-cover'
                                    : 'aspect-[16/10] w-full rounded-lg border border-gray-800 object-cover'
                            }
                        />
                    ) : (
                        /* No media in the CMS. A labelled panel keeps the row's
                           proportions instead of letting the text jump left. */
                        <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-gray-800 bg-gray-900/60">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-700">
                                No media
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h2 className="text-2xl font-medium tracking-tight text-gray-100 transition-colors group-hover:text-emerald-400 sm:text-[28px]">
                            {project.projectName}
                        </h2>
                        {meta && <span className="font-mono text-[11px] text-gray-500">{meta}</span>}
                    </div>

                    <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-gray-400 sm:text-base">
                        {firstSentence(project.projectDescription)}
                    </p>

                    {metrics.length > 0 && (
                        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
                            {metrics.map((metric, index) => (
                                /* Two per row on a phone, held by an explicit
                                   basis. Without it the labels decide the width,
                                   and these labels are written for the case page,
                                   where a 34ch column and a method line give them
                                   room. At 375px "Money streams in a purpose-built
                                   ledger" is 274px wide on one line, so two
                                   metrics stacked instead of pairing and stopped
                                   reading as one set. The label wraps now.
                                   The third is desktop-only either way. */
                                <div
                                    key={metric.label}
                                    className={[
                                        'basis-[calc(50%-0.75rem)] sm:basis-auto',
                                        index === 2 ? 'hidden sm:block' : '',
                                    ].join(' ')}
                                >
                                    <dd className="font-mono text-lg text-emerald-400 sm:text-xl">
                                        {metric.value}
                                    </dd>
                                    {/* The method stays on the case page. Here the
                                        label is all there is room to defend. */}
                                    <dt className="mt-1 max-w-[22ch] font-mono text-[9px] uppercase leading-[1.5] tracking-[0.18em] text-gray-500">
                                        {metric.label}
                                    </dt>
                                </div>
                            ))}
                        </dl>
                    )}

                    {shownChips.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {shownChips.map((tech) => (
                                <li
                                    key={tech.name}
                                    className="rounded-md border border-gray-800 bg-gray-900/60 px-2.5 py-1 font-mono text-[11px] text-gray-300"
                                >
                                    {tech.name}
                                </li>
                            ))}
                            {hiddenChips > 0 && (
                                <li className="rounded-md border border-dashed border-gray-800 px-2.5 py-1 font-mono text-[11px] text-gray-500">
                                    +{hiddenChips} more
                                </li>
                            )}
                        </ul>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-emerald-400">
                        Read the case
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </span>
                </div>
            </Link>
        </SlideInView>
    )
}
