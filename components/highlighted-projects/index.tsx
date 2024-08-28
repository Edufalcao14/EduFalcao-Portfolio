import { HorizontalDivider } from "../divider/horizontal"
import { ProjectCard } from "../project-card"
import { SectionTitle } from "../section-title"

export const HighlightProjects = () =>{
    return (
        <section className="container py-126 z-50">
            <SectionTitle subtitle="Highlight" title="Highlight Projects" />

            <HorizontalDivider className="mb-16" />

            <ProjectCard />
            <ProjectCard />
            <ProjectCard />


        </section>
    )
}