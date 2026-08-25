import { ProjectCardType } from "@/types/ProjectsInfo"
import Image from "next/image"
import { SlideInView } from "@/components/UI/slide-in-view"

interface ProjectDetailsProps {
  projectCard: ProjectCardType;
}

/**
 * Screenshot sections below the case.
 *
 * The Media collection accepts mp4 and webm alongside images, and next/image
 * cannot decode either: routing a video through it returns a 400 and the slot
 * renders empty. So the mime type decides the element.
 *
 * Alt text comes from the media itself. Deriving it from the section title
 * described the group rather than the screen, which is the one thing alt text
 * is for.
 */
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
              {section.image.map((media, index) =>
                media.mimeType?.startsWith('video/') ? (
                  <video
                    key={`${section.title}-media-${index}`}
                    src={media.url}
                    className="w-full aspect-auto rounded-lg"
                    controls
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    aria-label={media.alt || `${section.title} recording ${index + 1}`}
                  />
                ) : (
                  <Image
                    key={`${section.title}-media-${index}`}
                    src={media.url}
                    width={1080}
                    height={672}
                    className="w-full aspect-auto rounded-lg object-cover"
                    alt={media.alt || `${section.title} screenshot ${index + 1}`}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </section>
    </SlideInView>
  )
}
