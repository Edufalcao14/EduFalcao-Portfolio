import Link from "next/link"
import { TechBagde } from "@/components/tech-bagde"
import { ExperienceItemType } from "@/types/WorkExperiencesInfo"
import { RichText } from "@/components/rich-text"
import { SlideInView } from "@/components/UI/slide-in-view"

const monthYear = (value: string) =>
    new Date(value).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

/**
 * One role, laid out for reading rather than for scanning a timeline.
 *
 * The role title is the largest text in the block, the company and dates sit
 * under it in mono, and each product inside the role gets its own heading and
 * bullet list. Bullets are capped near 72 characters per line, because a bullet
 * that runs the full width of a desktop screen does not get read.
 */
export const ExperienceItem = (experience: ExperienceItemType) => {
    return (
        <SlideInView>
            {/*
              The bottom padding is unconditional. `last:pb-0` looked right and
              did nothing: SlideInView wraps each entry on its own, so every
              article is an only child and `last:` matched all of them, which
              collapsed the gap between every role.

              It also has to be padding rather than a gap on the container: the
              border-left is this element's, so padding keeps the timeline
              continuous while a gap would cut it into pieces.
            */}
            <article className="relative border-l border-gray-800 pl-6 sm:pl-10 pb-10">
                {/* Timeline marker, kept from the original design. */}
                <span
                    aria-hidden
                    className="absolute -left-[6px] top-2 h-[11px] w-[11px] rounded-full bg-emerald-500 ring-4 ring-gray-900"
                />

                <header className="flex flex-col gap-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-50 leading-snug">
                        {experience.title}
                    </h3>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-gray-400">
                        <span className="text-emerald-400">{experience.projectName}</span>
                        {experience.location && (
                            <>
                                <span aria-hidden className="text-gray-700">·</span>
                                <span>{experience.location}</span>
                            </>
                        )}
                        <span aria-hidden className="text-gray-700">/</span>
                        <span>
                            {monthYear(experience.startDate)}
                            {experience.endDate ? ` - ${monthYear(experience.endDate)}` : ' - Present'}
                        </span>
                    </p>
                </header>

                {experience.experienceText && (
                    <div className="mt-5 max-w-[72ch] text-gray-400 leading-relaxed">
                        <RichText content={experience.experienceText.raw} />
                    </div>
                )}

                {experience.projects.length > 0 && (
                    <div className="mt-8 flex flex-col gap-9">
                        {experience.projects.map((project) => (
                            <section key={project.name}>
                                <h4 className="flex flex-wrap items-baseline gap-x-2 pb-1">
                                    <span className="text-base sm:text-lg font-medium text-emerald-400">
                                        {project.name}
                                    </span>
                                    {project.descriptor && (
                                        <span className="font-mono text-xs sm:text-sm text-gray-500">
                                            {project.descriptor}
                                        </span>
                                    )}
                                </h4>

                                {project.bullets && (
                                    <div className="mt-3 max-w-[72ch] text-gray-400 leading-relaxed">
                                        <RichText content={project.bullets} />
                                    </div>
                                )}

                                {project.stack.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2 gap-y-3">
                                        {project.stack.map((tech) => (
                                            <TechBagde key={tech.name} name={tech.name} />
                                        ))}
                                    </div>
                                )}

                                {project.caseSlug && (
                                    <Link
                                        href={`/projects/${project.caseSlug}`}
                                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                                    >
                                        Read the case
                                        <span aria-hidden>&rarr;</span>
                                    </Link>
                                )}
                            </section>
                        ))}
                    </div>
                )}

                {experience.technology.length > 0 && (
                    <div className="mt-8">
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
                            Stack
                        </p>
                        <div className="flex flex-wrap gap-2 gap-y-3">
                            {experience.technology.map((item) => (
                                <TechBagde key={item.name} name={item.name} />
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </SlideInView>
    )
}
