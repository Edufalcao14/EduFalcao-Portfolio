import type { ProjectCardType, TechLayer } from "@/types/ProjectsInfo"
import { SlideInView } from "@/components/UI/slide-in-view"

interface CaseStackProps {
    projectCard: ProjectCardType;
}

/**
 * The stack, as columns rather than a heap of glowing pills.
 *
 * Two reasons for the change. A reader scanning a case wants to know which side
 * of the product each thing sits on, which a single undifferentiated row cannot
 * answer. And a wall of technology badges is a weak signal on its own: it reads
 * as a list of things touched rather than as judgement, so it belongs below the
 * numbers and the writing, not competing with the title.
 *
 * A technology with no `layer` is not dropped. It falls into a trailing
 * unlabelled column, because hiding part of a project's stack over an empty CMS
 * field would be the worse failure.
 */

const LAYERS: { layer: TechLayer; label: string }[] = [
    { layer: 'frontend', label: 'Frontend' },
    { layer: 'backend', label: 'Backend' },
    { layer: 'tooling', label: 'Tooling' },
]

export const CaseStack = ({ projectCard }: CaseStackProps) => {
    const technologies = projectCard.technology ?? []
    if (technologies.length === 0) return null

    const groups = [
        ...LAYERS.map(({ layer, label }) => ({
            label: label as string | null,
            items: technologies.filter((tech) => tech.layer === layer),
        })),
        { label: null, items: technologies.filter((tech) => !tech.layer) },
    ].filter((group) => group.items.length > 0)

    return (
        <SlideInView>
            <section className="container my-14 sm:my-20">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400 lg:pt-2">
                        The stack
                    </h2>

                    <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-gray-800 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <div key={group.label ?? 'other'}>
                                {group.label && (
                                    <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                                        {group.label}
                                    </h3>
                                )}
                                <ul className="mt-4 flex flex-col gap-2">
                                    {group.items.map((tech) => (
                                        <li key={tech.name} className="font-mono text-sm text-gray-300">
                                            {tech.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SlideInView>
    )
}
