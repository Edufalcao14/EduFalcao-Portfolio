import { MetadataRoute } from 'next'

import { getProjectSlugs } from '@/lib/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eduardofalcao.dev'

/**
 * Project pages are included. The old sitemap listed only the four static
 * routes, so every prerendered case was left out of the one file that tells a
 * crawler it exists.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSlugs()

  return [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resume`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    ...projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
