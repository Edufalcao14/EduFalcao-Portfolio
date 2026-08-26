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
/**
 * Whether the editor state holds anything a reader would see.
 *
 * A cleared rich text field does not come back as null. It comes back as a root
 * holding an empty paragraph, which is truthy, so a null check alone left this
 * section rendering its padded blurred container around nothing.
 */
const hasContent = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false

  const stack: unknown[] = [value]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!node || typeof node !== 'object') continue
    const record = node as Record<string, unknown>

    if (typeof record.text === 'string' && record.text.trim().length > 0) return true
    // Uploads and horizontal rules carry no text but are still content.
    if (typeof record.type === 'string' && ['upload', 'horizontalrule'].includes(record.type)) {
      return true
    }

    if (record.root) stack.push(record.root)
    if (Array.isArray(record.children)) stack.push(...record.children)
  }
  return false
}

export const CaseBody = ({ projectCard }: CaseBodyProps) => {
  if (!hasContent(projectCard.body)) return null

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
