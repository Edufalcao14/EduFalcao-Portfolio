import { HiArrowNarrowLeft } from 'react-icons/hi'

import { Link } from '@/components/Link'
import { SectionTitle } from '@/components/section-title'
import { SlideInView } from '@/components/UI/slide-in-view'

/**
 * The header above the article list.
 *
 * Deliberately the same shape as the projects introduction, so the two list
 * pages are recognisably the same page type. It is shorter, though: the projects
 * version reserves 450px of viewport before the first card, which on a list
 * whose rows are text is 450px of nothing.
 */
export const PageIntroduction = ({ mainText }: { mainText: string }) => (
  <SlideInView>
    <section className="flex w-full flex-col items-center justify-center px-2 pt-32 pb-10">
      <div className="flex flex-col items-center rounded-2xl px-6 py-8 backdrop-blur-sm sm:px-10">
        <SectionTitle
          subtitle="Articles"
          title="Writing"
          className="items-center text-center [&>h3]:text-4xl"
        />
        <div className="flex flex-col items-center">
          <p className="my-6 max-w-[640px] text-center text-sm text-gray-400 sm:text-base">
            {mainText}
          </p>
          <Link href="/">
            <HiArrowNarrowLeft />
            Go Back to Home
          </Link>
        </div>
      </div>
    </section>
  </SlideInView>
)
