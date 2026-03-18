import { SectionTitle } from "@/components/section-title";
import React from 'react';
import { ExperienceItem } from "./experienceItem";
import { ExperiencePageInfo } from "@/types/WorkExperiencesInfo";

type WorkExperienceProps = {
  experienceInfo: ExperiencePageInfo
}

export const WorkExperience = ({ experienceInfo }: WorkExperienceProps) => {
  return (
    <section className="container py-5 flex lg:gap-16 md:gap-4 sm:gap-10 flex-col md:flex-row">
      <div className="max-w-[420px] backdrop-blur-sm rounded-2xl p-6 h-fit">
        <SectionTitle title="Professional and Academic Experiences" subtitle="Experiences" />
        <p className="text-gray-400 mt-6 pb-5">
          I&apos;m always open to new challenges and exciting projects. Let&apos;s work together to create amazing solutions for your company!
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {experienceInfo.experienceItem.map((item) => (
          <ExperienceItem
            key={`${item.projectName}-${item.startDate}`}
            {...item}
          />
        ))}
      </div>
    </section>
  )
}
