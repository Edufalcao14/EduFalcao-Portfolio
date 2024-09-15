import { ProjectCardType, ProjectSection } from "@/app/types/projectsInfo";
import Image from "next/image";

type ProjectsProps = {
    projectInfo: {
        projectCard: ProjectCardType;
    };
};
export const ProjecSections = ({ projectInfo }: ProjectsProps) => {
   const sections = projectInfo.projectCard.projectSection
  return (
    <section className="container my-12 md:my-32 flex flex-col gap-8 md:gap-32">
      {sections.map((section) => (
        <div
          key={section.title}
          className="flex flex-col items-center text-center gap-6 md:gap-12"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-gray-300 py-6">
            {section.title}
          </h2>
          {section.image.map((img, index) => (
            <Image
              src={img.url}
              key={index}
              width={1080}
              height={672}
              className="w-full aspect-auto rounded-lg object-cover"
              alt={`Image of the section ${section.title}`}
              unoptimized
            />
          ))}
        </div>
      ))}
    </section>
  );
};
