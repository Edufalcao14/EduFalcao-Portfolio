import { SectionTitle } from "@/components/section-title"
import { SlideInView } from "@/components/UI/slide-in-view"
import { Education as EducationType } from "@/types/ResumePageInfo"

type EducationProps = {
  education: EducationType
}

const monthYear = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

/**
 * Last section, on purpose. Formal education is the weakest evidence on this
 * page, so it closes rather than opens it.
 */
export const Education = ({ education }: EducationProps) => {
  if (education.educationCard.length === 0) return null

  return (
    <SlideInView>
      <section id="studies" className="container py-16 pb-28">
        <div className="max-w-[720px]">
          <SectionTitle title="Studies & Formations" subtitle="Education" />
          {education.educationText && (
            <p className="text-gray-400 mt-6 leading-relaxed">{education.educationText}</p>
          )}
        </div>

        <ul className="mt-12 flex flex-col gap-4">
          {education.educationCard.map((card, index) => (
            <li
              key={`${card.institution}-${index}`}
              className="rounded-2xl border border-gray-800 bg-gray-900/40 px-6 py-5 transition-colors hover:border-emerald-600/40"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-lg font-medium text-gray-50">{card.degree}</h3>
                <span className="shrink-0 font-mono text-sm text-emerald-400">
                  {card.startDate || card.endDate
                    ? [card.startDate && monthYear(card.startDate), card.endDate && monthYear(card.endDate)]
                        .filter(Boolean)
                        .join(' - ')
                    : card.amountHours
                      ? `${card.amountHours} hours`
                      : ''}
                </span>
              </div>
              <p className="mt-1 font-mono text-sm text-gray-500">{card.institution}</p>
              {card.description && (
                <p className="mt-3 max-w-[68ch] text-sm text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </SlideInView>
  )
}
