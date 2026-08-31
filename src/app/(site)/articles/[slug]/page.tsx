import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HiArrowNarrowLeft } from 'react-icons/hi'

import { Link } from '@/components/Link'
import { Markdown } from '@/components/markdown'
import { getArticle, getSettings } from '@/lib/content'
import { formatMonth } from '@/lib/format'
import { toMetaDescription } from '@/lib/meta'

// Per request, cached, purged on publish. Same reasoning as the case pages.
export const dynamic = 'force-dynamic'

// Next 16 hands params in as a promise.
type ArticleProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  const description = article.seo.description || toMetaDescription(article.summary)
  const image = article.seo.image ?? article.cover?.url
  const title = article.seo.title || article.title

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function Article({ params }: ArticleProps) {
  const { slug } = await params
  const [article, settings] = await Promise.all([getArticle(slug), getSettings()])
  if (!article) notFound()

  const date = formatMonth(article.publishedAt ?? undefined)

  /**
   * Article schema for the crawler.
   *
   * A piece of writing that search cannot identify as writing is just a page.
   * The author is the one fact here that does not come from the article itself.
   */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt ?? undefined,
    author: { '@type': 'Person', name: settings.name },
    ...(article.cover?.url ? { image: article.cover.url } : {}),
  }

  return (
    <article className="container max-w-[760px] pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="border-b border-gray-800 pb-8">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/50">
          {date && <span>{date}</span>}
          {date && <span className="h-px w-6 bg-emerald-500/20" />}
          <span>{article.readingMinutes} min read</span>
        </div>

        <h1 className="mt-4 font-mono text-3xl font-bold leading-tight text-gray-50 sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 border-l-2 border-emerald-500/30 pl-4 text-sm leading-relaxed text-gray-400">
          {article.summary}
        </p>

        {article.topics.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
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
      </header>

      <div className="mt-10">
        <Markdown content={article.body} images={article.images} />
      </div>

      <footer className="mt-16 border-t border-gray-800 pt-8">
        <Link href="/articles">
          <HiArrowNarrowLeft />
          All articles
        </Link>
      </footer>
    </article>
  )
}
