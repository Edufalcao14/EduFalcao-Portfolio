import { SectionTitle } from "@/components/section-title"
import { CMSIcon } from "@/components/cms-icon"
import { RichText } from "@/components/rich-text"
import { SlideInView } from "@/components/UI/slide-in-view"
import { AboutMe, Social } from "@/types/ResumePageInfo"

type SummaryProps = {
  aboutMe: AboutMe
}

/** Facts that are not stored in the CMS because they do not change. */
const FACTS = [
  { label: "Name", value: "Eduardo Sampaio Falcão" },
  { label: "Nationality", value: "Brazilian" },
]

/**
 * Was "About Me", now "Professional Summary".
 *
 * The rename is the point: a recruiter scanning for a summary is looking for
 * what you do, and "About Me" promises a personal paragraph. The email is read
 * from Site settings, the only place it is stored.
 */
export const Summary = ({ aboutMe }: SummaryProps) => {
  return (
    <SlideInView>
      <section id="summary" className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionTitle title="Professional Summary" subtitle="Summary" />
            <div className="mt-6 max-w-[68ch] text-gray-300 leading-relaxed">
              <RichText content={aboutMe.aboutmeText.raw} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 h-fit">
            <dl className="flex flex-col gap-5">
              {FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-gray-500">
                    {fact.label}
                  </dt>
                  <dd className="text-gray-200">{fact.value}</dd>
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-gray-500">
                  Email
                </dt>
                <dd>
                  <a
                    href={`mailto:${aboutMe.email}`}
                    className="text-gray-200 hover:text-emerald-400 transition-colors break-all"
                  >
                    {aboutMe.email}
                  </a>
                </dd>
              </div>
            </dl>

            {aboutMe.socialsAboutMe.length > 0 && (
              <div className="mt-7 flex items-center gap-5 border-t border-gray-800 pt-6">
                {aboutMe.socialsAboutMe.map((contact: Social) => (
                  <a
                    href={contact.url}
                    key={contact.name}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={contact.name}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    <CMSIcon icon={contact.iconSvg} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SlideInView>
  )
}
