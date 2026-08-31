import Link from 'next/link'
import { HiArrowNarrowRight } from 'react-icons/hi'

import { formatMonth } from '@/lib/format'
import type { ArticleCardType } from '@/types/ArticlesInfo'

/**
 * One row in the article list.
 *
 * The card is a dateline, a title, the summary and the cost of reading it. No
 * cover thumbnail in the row: a list of images competes with itself, and the
 * title is what someone is actually choosing between. The cover earns its place
 * on the social card, not here.
 */
export const ArticleCard = ({ article }: { article: ArticleCardType }) => {
  const date = formatMonth(article.publishedAt ?? undefined)

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-t border-gray-800 py-8 transition-colors hover:border-emerald-500/30"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/50">
        {date && <span>{date}</span>}
        {date && <span className="h-px w-6 bg-emerald-500/20" />}
        <span>{article.readingMinutes} min</span>
      </div>

      <h2 className="mt-3 font-mono text-xl font-bold text-gray-100 transition-colors group-hover:text-emerald-300 sm:text-2xl">
        {article.title}
      </h2>

      <p className="mt-3 max-w-[680px] text-sm leading-relaxed text-gray-400">{article.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {article.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-gray-800 px-2.5 py-1 font-mono text-[11px] text-gray-500"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}
        <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
          Read
          <HiArrowNarrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}
