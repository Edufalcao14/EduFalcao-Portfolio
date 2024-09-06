
import React from "react";
import { PageIntroduction } from "@/components/pages/projects/page-introduction";
import { ProjectCard } from "@/components/pages/projects/project-card";
import { HorizontalDivider } from "@/components/divider/horizontal";

export const metadata = {
    title: 'Projects',
    description: 'Portfolio',
};


const Projects = () => {
    return (
        <section className=" bg-hero-image bg-cover bg-center bg-no-repeat">
            <PageIntroduction />
            <div className=" container mt-6">
                <ProjectCard />
                <HorizontalDivider className="my-16" />
                <ProjectCard />
                <HorizontalDivider className="my-16" />
                <ProjectCard />
                <HorizontalDivider className="my-16" />
            </div>

        </section>
    );
}

export default Projects;
