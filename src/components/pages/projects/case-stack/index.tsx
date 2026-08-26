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
 * dropped: it falls into a trailing row labelled "Also", since hiding part of a
 * project's stack over an empty CMS field would be the worse failure.
 *
 * One row per layer, label on the left and chips wrapping on the right, which is
 * how a spec sheet reads. It replaced parallel columns of plain text: with 18
 * entries split three ways, those columns ended at different heights and the eye
 * had nowhere to land. Rows also take any number of technologies without the
 * layout changing shape.
 *
 * The chips are deliberately quiet: a hairline border on the page's own ground,
 * not the filled emerald pill `TechBagde` draws. Eighteen of those, each with a
 * glow, would outshout the title they sit under. The accent is spent on the
 * metrics instead.
 *
 * No wrapper and no top rule of its own: it sits in the right half of the facts
 * block, which already draws the line above both columns. Adding one here put a
 * second hairline directly under the first, in the right column only.
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
        <div>
            {groups.map((group) => (
                <div
                    key={group.label ?? 'other'}
                    className="grid gap-3 border-b border-gray-800 py-4 last:border-b-0 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-6"
                >
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 sm:pt-[7px]">
                        {group.label ?? 'Also'}
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                        {group.items.map((tech) => (
                            <li
                                key={tech.name}
                                className="rounded-md border border-gray-800 bg-gray-900/60 px-2.5 py-1 font-mono text-xs text-gray-300"
                            >
                                {tech.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
