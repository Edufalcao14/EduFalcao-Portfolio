"use client";
import { Button } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { TechBagde } from "@/components/tech-bagde";// Fixed typo here
import { TbBrandGithub } from "react-icons/tb";
import { FiGlobe } from 'react-icons/fi';
import { Link } from "@/components/Link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { ProjectCardType } from "@/app/types/ProjectsInfo";
import { motion } from "framer-motion";

interface ProjectDetailsProps {
    projectCard: ProjectCardType;
}
export const ProjectDetails = ({projectCard}: ProjectDetailsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
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
                <div className="w-full max-w-[330px] flex flex-wrap gap-2 items-center justify-center">
                    {projectCard.technology.map((tech) => (
                        <TechBagde key={`${projectCard.projectName}-tech-${tech.name}`} name={tech.name} />
                    ))}
                </div>
                <div className="my-6 sm:my-12 flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                    {projectCard.githubUrl && (
                        <a href={projectCard.githubUrl} target="_blank">
                            <Button className="min-w-[180px]">
                                <TbBrandGithub size={20} />
                                Repository
                            </Button>
                        </a>
                    )}
                    {projectCard.liveUrl && (
                        <a href={projectCard.liveUrl} target="_blank">
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
        </motion.div>
    );
};
