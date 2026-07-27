import Link from "next/link"
import { IoCodeWorkingOutline } from "react-icons/io5"
import { TechBagde } from "@/components/tech-bagde"
import { ExperienceItemType } from "@/types/WorkExperiencesInfo"
import { RichText } from "@/components/rich-text"
import { SlideInView } from "@/components/UI/slide-in-view"

export const ExperienceItem = (experience: ExperienceItemType) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB')
    }

    return (
        <SlideInView>
            <div className="grid grid-cols-[40px,1fr] gap-4 md:gap-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full border border-gray-500">
                        <IoCodeWorkingOutline className="rounded-full p-1" style={{ width: 40, height: 40, color: 'rgb(52,211,153)' }} />
                    </div>
                    <div className="h-full w-[1px] bg-gray-700">
                    </div>
                </div>
                <div className="backdrop-blur-sm rounded-xl p-4">
                    <div className="flex flex-col gap-2 text-sm sm:text-base">
                        <p className="text-gray-500 hover:text-emerald-500 transition-colors">
                            @ {experience.projectName}
                        </p>
                        <h4 className="text-gray-300">{experience.title}</h4>
                        <span className="text-gray-500">
                            {formatDate(experience.startDate)}{experience.endDate ? ` - ${formatDate(experience.endDate)}` : ' - Present'}
                        </span>
                        {experience.experienceText && (
                            <div className="text-gray-400">
                                <RichText content={experience.experienceText.raw} />
                            </div>
                        )}
                    </div>

                    {/*
                      One role, several products. Each product gets its own name,
                      descriptor and bullets, the way the CV reads: the role sets
                      the context and the projects carry the evidence.
                    */}
                    {experience.projects.length > 0 && (
                        <div className="mt-6 flex flex-col gap-6">
                            {experience.projects.map((project) => (
                                <div key={project.name} className="border-l border-gray-700 pl-4">
                                    <h5 className="flex flex-wrap items-baseline gap-x-2 text-sm sm:text-base">
                                        <span className="text-emerald-400 font-medium italic">
                                            {project.name}
                                        </span>
                                        {project.descriptor && (
                                            <span className="text-gray-500 italic">
                                                — {project.descriptor}
                                            </span>
                                        )}
                                    </h5>
                                    {project.bullets && (
                                        <div className="mt-2 text-gray-400 text-sm sm:text-base">
                                            <RichText content={project.bullets} />
                                        </div>
                                    )}
                                    {project.caseSlug && (
                                        <Link
                                            href={`/projects/${project.caseSlug}`}
                                            className="mt-2 inline-block text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                                        >
                                            Read the case →
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {experience.technology.length > 0 && (
                        <>
                            <p className="text-gray-400 text-sm mb-3 mt-6 font-semibold">Stack</p>
                            <div className="flex gap-2 gap-y-3 flex-wrap lg:max-w-[350px] mb-8">
                                {experience.technology.map((item, index) => (
                                    <TechBagde key={index} name={item.name} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </SlideInView>
    )
}
