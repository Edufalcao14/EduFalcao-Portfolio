import { MetadataRoute } from 'next'

import { getArticleSlugs, getProjectSlugs } from '@/lib/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eduardofalcao.dev'

/**
 * Project pages are included. The old sitemap listed only the four static
 * routes, so every prerendered case was left out of the one file that tells a
 * crawler it exists.
 */
// Generated per request for the same reason the pages are: no database exists
// while the image is being built.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A sitemap missing its case pages is a bad day for SEO; a sitemap that takes
  // the whole site down is a worse one. If the database is unreachable, ship the
  // static routes rather than throwing.
  let projects: { slug: string }[] = []
  try {
    projects = await getProjectSlugs()
  } catch (error) {
    console.error('Sitemap could not read projects:', error)
  }

  let articles: { slug: string; publishedAt: string | null }[] = []
  try {
    articles = await getArticleSlugs()
  } catch (error) {
    console.error('Sitemap could not read articles:', error)
  }

  return [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resume`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    ...projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      // `lastModified` is what tells a crawler a piece was revised; the
      // publish date is the closest honest value we hold.
      ...(article.publishedAt ? { lastModified: new Date(article.publishedAt) } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
