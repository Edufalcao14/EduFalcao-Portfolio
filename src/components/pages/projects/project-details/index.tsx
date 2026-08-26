import { Button } from "@/components/button"
import { SectionTitle } from "@/components/section-title"
import { TechBagde } from "@/components/tech-bagde"
import { TbBrandGithub } from "react-icons/tb"
import { FiGlobe } from 'react-icons/fi'
import { Link } from "@/components/Link"
import { HiArrowNarrowLeft } from "react-icons/hi"
import { ProjectCardType } from "@/types/ProjectsInfo"
import { SlideInView } from "@/components/UI/slide-in-view"

interface ProjectDetailsProps {
    projectCard: ProjectCardType;
}

/** Group order, and the label each one renders under. */
const TECH_LAYERS = [
    { layer: 'frontend', label: 'Frontend' },
    { layer: 'backend', label: 'Backend' },
    { layer: 'tooling', label: 'Tooling' },
] as const

/**
 * Splits the stack into the groups a reader actually scans for, keeping the
 * order above rather than the order the relationship happens to be stored in.
 *
 * A technology with no `layer` is not dropped: it falls into a trailing
 * unlabelled group. Silently hiding part of a project's stack because a CMS
 * field was left empty would be the worse failure, and empty groups never
 * render a heading with nothing under it.
 */
const groupTechnologies = (technologies: ProjectCardType['technology']) => {
    const groups = TECH_LAYERS.map(({ layer, label }) => ({
        label: label as string | null,
        items: technologies.filter((tech) => tech.layer === layer),
    }))

    const ungrouped = technologies.filter((tech) => !tech.layer)
    if (ungrouped.length > 0) groups.push({ label: null, items: ungrouped })

    return groups.filter((group) => group.items.length > 0)
}

export const ProjectDetails = ({ projectCard }: ProjectDetailsProps) => {
    return (
        <SlideInView>
            <section className="w-full sm:min-h-[750px] flex flex-col items-center justify-end relative pb-10 sm:pb-24 py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-[-1]"
                    style={{
                        background: `url(/images/hero-bg.png) no-repeat center/cover , url(${projectCard.thumbPhoto.url}) no-repeat center/cover `,
                    }}
                />
                <SectionTitle
                    subtitle="Projects"
                    title={projectCard.projectName}
                    className="text-center items-center sm:[&>h3]:text-4xl"
                />
                <p className="text-gray-400 text-center max-w-[640px] my-4 sm:my-6 text-sm lg:text-base">
                    {projectCard.projectDescription}
                </p>
                <div className="w-full max-w-[420px] flex flex-col gap-4">
                    {groupTechnologies(projectCard.technology).map((group) => (
                        <div key={group.label ?? 'ungrouped'} className="flex flex-col gap-2">
                            {group.label && (
                                <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500 text-center">
                                    {group.label}
                                </span>
                            )}
                            <div className="flex flex-wrap gap-2 items-center justify-center">
                                {group.items.map((tech) => (
                                    <TechBagde
                                        key={`${projectCard.projectName}-tech-${tech.name}`}
                                        name={tech.name}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="my-6 sm:my-12 flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                    {projectCard.githubUrl && (
                        <a href={projectCard.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="min-w-[180px]">
                                <TbBrandGithub size={20} />
                                Repository
                            </Button>
                        </a>
                    )}
                    {projectCard.liveUrl && (
                        <a href={projectCard.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="min-w-[180px]">
                                <FiGlobe size={20} />
                                Live Site
                            </Button>
                        </a>
                    )}
                </div>
                <Link href="/projects">
                    <HiArrowNarrowLeft size={18} />
                    Go back to projects
                </Link>
            </section>
        </SlideInView>
    )
}
