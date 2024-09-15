import { Button } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { TechBagde } from "@/components/tech-bagde";// Fixed typo here
import { TbBrandGithub } from "react-icons/tb";
import { FiGlobe } from 'react-icons/fi';
import { Link } from "@/components/Link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { ProjectCardType } from "@/app/types/projectsInfo";

type ProjectDetailsProps = {
    projectInfo: {
        projectCard: ProjectCardType;
    };
};

export const ProjectDetails = ({ projectInfo }: ProjectDetailsProps) => {
    return (
        <section className="w-full sm:min-h-[750px] flex flex-col items-center justify-end relative pb-10 sm:pb-24 py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 z-[-1]"
                style={{
                    background: `url(/images/hero-bg.png) no-repeat center/cover , url(${projectInfo.projectCard.thumbPhoto.url}) no-repeat center/cover `,
                }}
            />
            <SectionTitle
                subtitle="Projects"
                title={projectInfo.projectCard.projectName}
                className="text-center items-center sm:[&>h3]:text-4xl"
            />
            <p className="text-gray-400 text-center max-w-[640px] my-4 sm:my-6 text-sm lg:text-base">
                {projectInfo.projectCard.projectDescription}
            </p>
            <div className="w-full max-w-[330px] flex flex-wrap gap-2 items-center justify-center">
                {projectInfo.projectCard.technology.map((tech) => (
                    <TechBagde key={`${projectInfo.projectCard.projectName}-tech-${tech.name}`} name={tech.name} />
                ))}
            </div>
            <div className="my-6 sm:my-12 flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                {projectInfo.projectCard.githubUrl && (
                    <a href={projectInfo.projectCard.githubUrl} target="_blank">
                        <Button className="min-w-[180px]">
                            <TbBrandGithub size={20} />
                            Repository
                        </Button>
                    </a>
                )}
                {projectInfo.projectCard.liveUrl && (
                    <a href={projectInfo.projectCard.liveUrl} target="_blank">
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
    );
};
