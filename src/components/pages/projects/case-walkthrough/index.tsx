import Image from "next/image"

import { SlideInView } from "@/components/UI/slide-in-view"
import type { Image as Media, ProjectSection, ProjectCardType } from "@/types/ProjectsInfo"

interface CaseWalkthroughProps {
    projectCard: ProjectCardType;
}

/**
 * The screens, walked through instead of stacked.
 *
 * The old gallery was one column of full-width images, twenty-seven of them for
 * this case, with alt text generated from the section title. A reader scrolled
 * past screenshots with nothing telling them why any of it mattered.
 *
 * Here each section pins its text while its images move past. That is
 * `position: sticky` and nothing else: no scroll listener, no JS, no library, so
 * there is no animation to disable under `prefers-reduced-motion` and no layout
 * that breaks with JS off. Below the `lg` breakpoint it is a plain stepped
 * sequence, which is the right shape for a phone rather than a degraded one.
 *
 * A section whose `description` is empty still renders: the column keeps its
 * number and title, and the images sit beside it. The field being optional costs
 * the layout nothing.
 */

const MediaItem = ({ media, fallbackAlt }: { media: Media; fallbackAlt: string }) => {
    // next/image cannot decode mp4 or webm; routing one through it returns a 400
    // and renders an empty slot. The mime type decides the element.
    if (media.mimeType?.startsWith('video/')) {
        return (
            <video
                src={media.url}
                // A dark ground and a reserved box: `preload="metadata"` does not
                // paint the first frame in every browser, and without these the
                // slot was a tall white void that read as a broken image, then
                // shifted the layout once the metadata arrived.
                className="aspect-video w-full rounded-lg border border-gray-800 bg-gray-900 object-contain"
                controls
                playsInline
                muted
                loop
                preload="metadata"
                aria-label={media.alt || fallbackAlt}
            />
        )
    }

    return (
        <Image
            src={media.url}
            width={1280}
            height={800}
            className="h-auto w-full rounded-lg border border-gray-800"
            alt={media.alt || fallbackAlt}
        />
    )
}

const Step = ({
    section,
    index,
    total,
}: {
    section: ProjectSection
    index: number
    total: number
}) => (
    <article className="grid gap-7 border-t border-gray-800 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14 lg:pt-14">
        <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="font-mono text-xs text-gray-500">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-gray-100 sm:text-3xl">
                {section.title}
            </h2>
            {section.description && (
                <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-gray-400 sm:text-base">
                    {section.description}
                </p>
            )}
        </div>

        <div className="flex flex-col gap-5">
            {section.image.map((media, mediaIndex) => (
                <MediaItem
                    key={`${section.title}-${mediaIndex}`}
                    media={media}
                    fallbackAlt={`${section.title}, screen ${mediaIndex + 1}`}
                />
            ))}
        </div>
    </article>
)

export const CaseWalkthrough = ({ projectCard }: CaseWalkthroughProps) => {
    const sections = projectCard.projectSection ?? []
    // No sections means no walkthrough. The page ends after the stack, which is
    // the correct ending for a project that has no screens to show.
    if (sections.length === 0) return null

    return (
        <SlideInView>
            <section className="container my-16 sm:my-24">
                <div className="mb-8 flex items-baseline justify-between gap-4">
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                        The walkthrough
                    </h2>
                    <span className="font-mono text-xs text-gray-500">
                        {sections.length} {sections.length === 1 ? 'section' : 'sections'}
                    </span>
                </div>

                <div className="flex flex-col gap-14 sm:gap-24">
                    {sections.map((section, index) => (
                        <Step
                            key={section.title}
                            section={section}
                            index={index}
                            total={sections.length}
                        />
                    ))}
                </div>
            </section>
        </SlideInView>
    )
}
