"use client";
import { ProjectCardType, ProjectPageData, ProjectSection } from "@/app/types/ProjectsInfo";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectDetailsProps {
  projectCard: ProjectCardType;
}

export const ProjectSections = ({ projectCard }: ProjectDetailsProps) => { // Desestruturação correta
  const sections = projectCard.projectSection;

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <section className="container my-12 md:my-32 flex flex-col gap-8 md:gap-32">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex flex-col items-center text-center gap-6 md:gap-12"
          >
            <h2 className="text-2xl md:text-3xl font-medium text-gray-300 py-6">
              {section.title}
            </h2>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          </div>
        ))}
      </section>
    </motion.div>
  );
};
