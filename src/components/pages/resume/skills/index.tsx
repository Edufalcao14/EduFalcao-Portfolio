import { SectionTitle } from "@/components/section-title"
import { CMSIcon } from "@/components/cms-icon"
import { SlideInView } from "@/components/UI/slide-in-view"
import { Skill } from "@/types/ResumePageInfo"

type SkillsProps = {
  skill: Skill
}

/**
 * The skills grid, out of the tab it used to hide inside.
 *
 * The name is now printed under each icon instead of living in a hover tooltip.
 * A tooltip is invisible on a phone, and most of the audience arrives on one, so
 * the previous version showed a recruiter a grid of unlabelled logos.
 */
export const Skills = ({ skill }: SkillsProps) => {
  if (skill.skillCard.length === 0) return null

  return (
    <SlideInView>
      <section id="skills" className="container py-16">
        <div className="max-w-[720px]">
          <SectionTitle title="Skills" subtitle="Stack" />
          {skill.skillText && (
            <p className="text-gray-400 mt-6 leading-relaxed">{skill.skillText}</p>
          )}
        </div>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {skill.skillCard.map((card) => (
            <li
              key={card.name}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 px-3 py-6 transition-colors hover:border-emerald-600/60"
            >
              <div className="text-3xl text-gray-300 transition-colors group-hover:text-emerald-400">
                <CMSIcon icon={card.skillIcon} />
              </div>
              <span className="text-center font-mono text-xs text-gray-400 transition-colors group-hover:text-gray-200">
                {card.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </SlideInView>
  )
}
