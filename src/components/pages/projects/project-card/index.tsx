import { IoMdCode } from "react-icons/io"
import { TechBagde } from "@/components/tech-bagde"
import { Link } from "@/components/Link"
import { HiArrowNarrowRight } from "react-icons/hi"
import { ProjectCardType } from "@/types/ProjectsInfo"
import { SlideInView } from "@/components/UI/slide-in-view"
import { ProjectMedia } from "@/components/UI/project-media"

type ProjectCardProps = {
    project: ProjectCardType
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <SlideInView>
            <div className="flex gap-6 lg:gap-12 flex-col lg:flex-row">
                <div className="w-full h-full">
                    {project.thumbPhoto && project.thumbPhoto.url ? (
                        <ProjectMedia
                            media={project.thumbPhoto}
                            alt={`${project.projectName} thumbnail`}
                            width={480}
                            height={300}
                            mode="poster"
                            className="w-full h-[200px] lg:min-h-full object-cover rounded-lg z-1 bg-gray-900"
                        />
                    ) : (
                        <div className="w-full h-[200px] lg:min-h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">No Image Available</p>
                        </div>
                    )}
                </div>

                <div className="backdrop-blur-sm rounded-xl p-5">
                    <h3 className="flex items-center gap-3 font-medium text-lg text-gray-50">
                        <IoMdCode style={{ width: 30, height: 30, color: 'rgb(52,211,153)' }} />
                        {project.projectName}
                    </h3>
                    <p className="text-gray-400 my-6">
                        {project.projectDescription}
                    </p>
                    <div className="flex gap-x-2 gap-y-3 flex-wrap mb-8 lg:max-w-[350px]">
                        {project.technology.map((tech) => (
                            <TechBagde key={`${project.projectName}-tech-${tech.name}`} name={tech.name} />
                        ))}
                    </div>
                    <Link href={`/projects/${project.slug}`}>
                        Check Project
                        <HiArrowNarrowRight />
                    </Link>
                </div>
            </div>
        </SlideInView>
    )
}
