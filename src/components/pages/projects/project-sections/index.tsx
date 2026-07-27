import { ProjectCardType } from "@/types/ProjectsInfo"
import Image from "next/image"
import { SlideInView } from "@/components/UI/slide-in-view"

interface ProjectDetailsProps {
  projectCard: ProjectCardType;
}

export const ProjectSections = ({ projectCard }: ProjectDetailsProps) => {
  const sections = projectCard.projectSection;

  return (
    <SlideInView>
      <section className="container my-12 md:my-32 flex flex-col gap-8 md:gap-32">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex flex-col items-center text-center gap-6 md:gap-12"
          >
            <h2 className="text-2xl md:text-3xl font-medium text-gray-300 py-6">
              {section.title}
            </h2>
            <div className="flex flex-col gap-4">
              {section.image.map((img, index) => (
                <Image
                  key={`${section.title}-img-${index}`}
                  src={img.url}
                  width={1080}
                  height={672}
                  className="w-full aspect-auto rounded-lg object-cover"
                  alt={`${section.title} screenshot ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </SlideInView>
  )
}
