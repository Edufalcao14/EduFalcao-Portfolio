import { RichText } from "@/components/rich-text"
import { SlideInView } from "@/components/UI/slide-in-view"
import { ProjectCardType } from "@/types/ProjectsInfo"

interface CaseBodyProps {
  projectCard: ProjectCardType
}

/**
 * The case narrative: context, problem, constraint, decision, tradeoff, result.
 *
 * New with the Payload backend. Hygraph had nowhere to put it, so the old detail
 * page showed only a one-line description and a wall of screenshots. It uses the
 * same rich text renderer and type scale as the rest of the site, so it reads as
 * part of the existing page rather than a bolted-on section.
 */
export const CaseBody = ({ projectCard }: CaseBodyProps) => {
  if (!projectCard.body) return null

  return (
    <SlideInView>
      <section className="container my-12 md:my-20">
        <div className="max-w-[680px] mx-auto text-gray-400 backdrop-blur-sm rounded-xl p-6 sm:p-8">
          <RichText content={projectCard.body} />
        </div>
      </section>
    </SlideInView>
  )
}
