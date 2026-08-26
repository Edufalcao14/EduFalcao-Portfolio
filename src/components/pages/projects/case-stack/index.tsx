import type { ProjectCardType, TechLayer } from "@/types/ProjectsInfo"

interface StackRailProps {
    technologies: ProjectCardType['technology'];
}

/**
 * The stack, in columns, directly under the facts.
 *
 * It used to be its own section far down the page, below the writing and the
 * metrics. That put it after the point most readers stop, and it read as a
 * trailing list of things touched. A reader who has just learned the role and
 * the company wants the stack next, so it sits there instead.
 *
 * Grouped by `layer` because a single undifferentiated row cannot answer which
 * side of the product each thing sits on. A technology with no layer is not
 * dropped: it falls into a trailing unlabelled column, since hiding part of a
 * project's stack over an empty CMS field would be the worse failure.
 *
 * No wrapper of its own. It composes inside the hero's container, so the rails
 * above and below it line up on the same grid.
 */

const LAYERS: { layer: TechLayer; label: string }[] = [
    { layer: 'frontend', label: 'Frontend' },
    { layer: 'backend', label: 'Backend' },
    { layer: 'tooling', label: 'Tooling' },
]

export const StackRail = ({ technologies }: StackRailProps) => {
    const items = technologies ?? []
    if (items.length === 0) return null

    const groups = [
        ...LAYERS.map(({ layer, label }) => ({
            label: label as string | null,
            items: items.filter((tech) => tech.layer === layer),
        })),
        { label: null, items: items.filter((tech) => !tech.layer) },
    ].filter((group) => group.items.length > 0)

    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 border-t border-gray-800 pt-5 sm:grid-cols-3 lg:grid-cols-4">
            {groups.map((group) => (
                <div key={group.label ?? 'other'}>
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        {group.label ?? 'Also'}
                    </h2>
                    <ul className="mt-3 flex flex-col gap-1.5">
                        {group.items.map((tech) => (
                            <li key={tech.name} className="text-sm text-gray-200">
                                {tech.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
