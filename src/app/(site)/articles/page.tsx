import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ArticleCard } from '@/components/pages/articles/article-card'
import { PageIntroduction } from '@/components/pages/articles/page-introduction'
import { getArticlesPageInfo, getSettings } from '@/lib/content'
import { toMetaDescription } from '@/lib/meta'

// Rendered per request for the same reason every content route is: the build
// container has no database. Reads are cached and purged on publish.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getArticlesPageInfo(), getSettings()])
  return {
    title: 'Articles',
    description: toMetaDescription(page.mainText) || settings.defaultDescription,
  }
}

async function ArticlesContent() {
  const { mainText, articles } = await getArticlesPageInfo()

  return (
    <>
      <PageIntroduction mainText={mainText} />
      {articles.length > 0 ? (
        <ul className="container border-b border-gray-800 pb-4">
          {articles.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        // An empty list still has to say something. Silence reads as a broken
        // page; this reads as a section that has not started yet.
        <p className="container border-t border-gray-800 py-10 font-mono text-sm text-gray-500">
          Nothing published here yet.
        </p>
      )}
    </>
  )
}

export default function Articles() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <ArticlesContent />
    </Suspense>
  )
}
