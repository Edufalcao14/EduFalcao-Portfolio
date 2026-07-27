import { SectionTitle } from "@/components/section-title";
import { ExperienceItem } from "./experienceItem";
import { ExperiencePageInfo } from "@/types/WorkExperiencesInfo";

type WorkExperienceProps = {
  experienceInfo: ExperiencePageInfo
}

/**
 * The lead section of the resume page.
 *
 * It used to sit below the tabs in a narrow right-hand column, sharing the row
 * with an intro card. Now it owns the full width: the roles are the reason
 * anyone opens this page, and the intro copy moved down to the summary.
 */
export const WorkExperience = ({ experienceInfo }: WorkExperienceProps) => {
  return (
    <section id="experience" className="container pt-32 pb-8">
      <div className="max-w-[720px]">
        <SectionTitle title="Professional Experience" subtitle="Experiences" />
        {experienceInfo.mainText && (
          <p className="text-gray-400 mt-6 leading-relaxed">{experienceInfo.mainText}</p>
        )}
      </div>

      <div className="mt-14">
        {experienceInfo.experienceItem.map((item) => (
          <ExperienceItem key={`${item.projectName}-${item.startDate}`} {...item} />
        ))}
      </div>
    </section>
  )
}
