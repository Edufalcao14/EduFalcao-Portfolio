import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { TAGS } from './revalidate'
import type {
  ArticleCardType,
  ArticleImage,
  ArticlesPageInfo,
  ArticleType,
} from '@/types/ArticlesInfo'
import type { HomePageInfo, Social } from '@/types/HomePageInfo'
import type { ProjectCardType, ProjectsPageInfo } from '@/types/ProjectsInfo'
import type { EducationCard, ResumePageInfo, SkillCard } from '@/types/ResumePageInfo'
import type { ExperienceItemType, ExperiencePageInfo } from '@/types/WorkExperiencesInfo'
import type {
  Article,
  Education,
  Experience,
  Media,
  Project,
  Technology,
} from '@/payload-types'

/**
 * The adapter layer.
 *
 * The frontend components were written against Hygraph's response shapes. Rather
 * than rewrite every component for Payload's shapes, this module reads from
 * Payload through the Local API and returns the exact same types the components
 * already expect. Swapping the CMS becomes a change in one file instead of
 * twenty.
 *
 * The old `fetchHygraphQuery` helper is gone; these functions replace it.
 */
const client = async () => getPayload({ config })

/**
 * Tag purges from the publish hooks make updates instant, but they only work
 * inside a Next runtime. A seed or an import runs as a standalone script and
 * cannot purge anything, so this bound is the self-heal.
 */
const CACHE_SAFETY_NET_SECONDS = 3600

/** What the hero pill said before it was editable, kept for an empty field. */
const HERO_ROLE_TAG_FALLBACK = 'Full Stack Developer'

const mediaUrl = (value: unknown, size: 'thumb' | 'card' | 'full' = 'card'): string => {
  if (!value || typeof value !== 'object') return ''
  const media = value as Media
  return media.sizes?.[size]?.url ?? media.url ?? ''
}

const mediaMime = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') return undefined
  return (value as Media).mimeType ?? undefined
}

const relations = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value.filter((entry) => typeof entry === 'object') as T[]) : []

const toSocial = (entry: { url: string; iconSvg?: string | null }): Social => ({
  url: entry.url,
  iconSvg: entry.iconSvg ?? '',
})

/** Shared by the header, footer and both social rows. */
export const getSettings = unstable_cache(
  async () => {
    const payload = await client()
    return payload.findGlobal({ slug: 'siteSettings', depth: 1 })
  },
  ['settings'],
  { tags: [TAGS.settings], revalidate: CACHE_SAFETY_NET_SECONDS },
)

export const getHomeInfo = unstable_cache(
  async (): Promise<HomePageInfo> => {
    const payload = await client()
    const [home, settings] = await Promise.all([
      payload.findGlobal({ slug: 'homePage', depth: 1 }),
      payload.findGlobal({ slug: 'siteSettings', depth: 1 }),
    ])

    return {
      // The pill has to say something: an empty one renders as a bare outline.
      heroRoleTag: home.heroRoleTag ?? HERO_ROLE_TAG_FALLBACK,
      introduction: { raw: home.introduction },
      socials: (settings.socials ?? []).map(toSocial),
    }
  },
  ['home-info'],
  { tags: [TAGS.home, TAGS.settings], revalidate: CACHE_SAFETY_NET_SECONDS },
)

/** Maps one case into the card shape the components render. */
const toProjectCard = (project: Project): ProjectCardType => ({
  slug: project.slug,
  projectName: project.title,
  projectDescription: project.summary,
  githubUrl: project.links?.repoUrl ?? undefined,
  // liveUrl keeps the old fallback chain so the project cards on /projects,
  // which only render one link, are unchanged. The case page reads the store
  // URLs separately so it can name each button.
  liveUrl: project.links?.liveUrl ?? project.links?.appStore ?? project.links?.playStore ?? undefined,
  appStoreUrl: project.links?.appStore ?? undefined,
  playStoreUrl: project.links?.playStore ?? undefined,
  // A video has no `sizes`, so mediaUrl falls back to the original file.
  thumbPhoto: { url: mediaUrl(project.thumbnail), mimeType: mediaMime(project.thumbnail) },
  projectSection: (project.projectSection ?? []).map((section) => ({
    title: section.title,
    description: section.description ?? undefined,
    // A video has no `sizes`, so mediaUrl falls back to the original. mimeType
    // travels with it so the gallery can tell the two apart.
    image: relations<Media>(section.image).map((image) => ({
      url: mediaUrl(image, 'full'),
      alt: image.alt,
      mimeType: image.mimeType ?? undefined,
    })),
  })),
  technology: relations<Technology>(project.tech).map((tech) => ({
    name: tech.name,
    layer: tech.layer ?? undefined,
  })),
  body: project.body,
  role: project.role ?? undefined,
  company: project.company ?? undefined,
  periodStart: project.periodStart ?? undefined,
  periodEnd: project.periodEnd ?? undefined,
  kind: project.kind ?? undefined,
  // An empty array and an absent one mean the same thing here: no band.
  metrics: (project.metrics ?? []).length > 0
    ? (project.metrics ?? []).map((m) => ({ value: m.value, label: m.label, method: m.method }))
    : undefined,
})

export const getProjectsPageInfo = unstable_cache(
  async (): Promise<ProjectsPageInfo> => {
    const payload = await client()
    const [page, projects] = await Promise.all([
      payload.findGlobal({ slug: 'projectsPage', depth: 1 }),
      payload.find({
        collection: 'projects',
        where: { _status: { equals: 'published' } },
        // Hand-placed order first, then newest. Academic work sinks to the end
        // regardless, so it never leads the list.
        sort: ['order', '-periodStart'],
        depth: 2,
        limit: 100,
      }),
    ])

    const docs = [...projects.docs].sort((a, b) => {
      const rank = (project: Project) => (project.proofTier === 'tier4' ? 1 : 0)
      return rank(a) - rank(b)
    })

    return {
      mainText: page.mainText,
      projectCard: docs.map(toProjectCard),
    }
  },
  ['projects-page'],
  { tags: [TAGS.projectsPage, TAGS.projects], revalidate: CACHE_SAFETY_NET_SECONDS },
)

export const getProjectCard = unstable_cache(
  async (slug: string): Promise<ProjectCardType | null> => {
    const payload = await client()
    const result = await payload.find({
      collection: 'projects',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      depth: 2,
      limit: 1,
    })
    const project = result.docs[0]
    return project ? toProjectCard(project) : null
  },
  ['project-card'],
  { tags: [TAGS.projects], revalidate: CACHE_SAFETY_NET_SECONDS },
)

export const getProjectSlugs = unstable_cache(
  async (): Promise<{ slug: string }[]> => {
    const payload = await client()
    const result = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 200,
      select: { slug: true },
    })
    return result.docs.map((project) => ({ slug: project.slug }))
  },
  ['project-slugs'],
  { tags: [TAGS.projects], revalidate: CACHE_SAFETY_NET_SECONDS },
)

const toEducationCard = (entry: Education): EducationCard => ({
  institution: entry.institution,
  degree: entry.degree,
  startDate: entry.startDate ?? null,
  endDate: entry.endDate ?? null,
  amountHours: entry.hours ?? null,
  description: entry.description ?? null,
})

const toSkillCard = (tech: Technology): SkillCard => ({
  name: tech.name,
  skillIcon: tech.iconSvg ?? '',
})

export const getResumeInfo = unstable_cache(
  async (): Promise<ResumePageInfo> => {
    const payload = await client()
    const [page, settings, education, technologies] = await Promise.all([
      payload.findGlobal({ slug: 'resumePage', depth: 1 }),
      payload.findGlobal({ slug: 'siteSettings', depth: 1 }),
      payload.find({ collection: 'education', sort: '-startDate', limit: 50 }),
      payload.find({
        collection: 'technologies',
        where: { highlight: { equals: true } },
        // Hand-set order first; anything without a number sorts by name after.
        sort: ['order', 'name'],
        limit: 100,
      }),
    ])

    return {
      education: {
        educationText: page.educationText ?? '',
        educationCard: education.docs.map(toEducationCard),
      },
      aboutMe: {
        aboutmeText: { raw: page.aboutMeText },
        email: settings.email,
        socialsAboutMe: (settings.socials ?? []).map((entry) => ({
          name: entry.label,
          ...toSocial(entry),
        })),
      },
      skill: {
        skillText: page.skillText ?? '',
        // An icon is still required: the grid renders an SVG per cell, and a cell
        // without one reads as a broken image.
        skillCard: technologies.docs.filter((tech) => tech.iconSvg).map(toSkillCard),
      },
    }
  },
  ['resume-info'],
  { tags: [TAGS.resume, TAGS.settings], revalidate: CACHE_SAFETY_NET_SECONDS },
)

const toExperienceItem = (experience: Experience): ExperienceItemType => ({
  projectName: experience.company,
  title: experience.role,
  location: experience.location ?? null,
  startDate: experience.startDate,
  endDate: experience.endDate ?? null,
  experienceText: experience.body ? { raw: experience.body } : null,
  projects: (experience.projects ?? []).map((project) => ({
    name: project.name,
    descriptor: project.descriptor ?? null,
    bullets: project.bullets ?? null,
    stack: relations<Technology>(project.stack).map((tech) => ({ name: tech.name })),
    caseSlug:
      project.case && typeof project.case === 'object' ? (project.case.slug as string) : null,
  })),
  technology: relations<Technology>(experience.tech).map((tech) => ({ name: tech.name })),
})

export const getExperienceInfo = unstable_cache(
  async (): Promise<ExperiencePageInfo> => {
    const payload = await client()
    const [page, experiences] = await Promise.all([
      payload.findGlobal({ slug: 'resumePage', depth: 1 }),
      payload.find({
        collection: 'experiences',
        // Hand-set order first; anything without a number falls to the end,
        // newest first.
        sort: ['order', '-startDate'],
        depth: 2,
        limit: 50,
      }),
    ])

    return {
      mainText: page.experienceText ?? '',
      experienceItem: experiences.docs.map(toExperienceItem),
    }
  },
  ['experience-info'],
  { tags: [TAGS.resume], revalidate: CACHE_SAFETY_NET_SECONDS },
)

/**
 * Words per minute for the reading estimate. The usual figure for prose is 200
 * to 250; the lower end is right here, because these pieces carry code and
 * diagrams and nobody skims those.
 */
const WORDS_PER_MINUTE = 200

const readingMinutes = (markdown: string): number => {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  // A short note is "1 min", never "0 min".
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

const toArticleCard = (article: Article): ArticleCardType => ({
  slug: article.slug,
  title: article.title,
  summary: article.summary,
  publishedAt: article.publishedAt ?? null,
  readingMinutes: readingMinutes(article.body ?? ''),
  topics: (article.topics ?? []).map((topic) => topic.label),
  cover:
    article.cover && typeof article.cover === 'object'
      ? {
          url: mediaUrl(article.cover, 'card'),
          alt: (article.cover as Media).alt,
          mimeType: mediaMime(article.cover),
        }
      : undefined,
})

/**
 * The body references images by filename. Resolving them here means the markdown
 * renderer is a pure function of its props: it never queries anything, so it
 * cannot be the reason a page is slow.
 */
const toArticleImages = (article: Article): ArticleImage[] =>
  relations<Media>(article.media)
    .filter((image) => typeof image.filename === 'string')
    .map((image) => {
      // 'full' rather than 'card': an article image is the width of the column.
      // An SVG has no sizes at all, so this falls back to the original file.
      const rendition = image.sizes?.full?.url ? image.sizes.full : image
      return {
        filename: image.filename as string,
        url: rendition.url ?? '',
        alt: image.alt,
        // The dimensions have to describe the file in `url`, not the original:
        // a 3024px width on a 1920px image is a wrong aspect ratio waiting to
        // shift the layout.
        width: rendition.width ?? undefined,
        height: rendition.height ?? undefined,
        mimeType: image.mimeType ?? undefined,
      }
    })

export const getArticlesPageInfo = unstable_cache(
  async (): Promise<ArticlesPageInfo> => {
    const payload = await client()
    const [page, articles] = await Promise.all([
      payload.findGlobal({ slug: 'articlesPage', depth: 1 }),
      payload.find({
        collection: 'articles',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        depth: 1,
        limit: 100,
      }),
    ])

    return {
      mainText: page.mainText,
      articles: articles.docs.map(toArticleCard),
    }
  },
  ['articles-page'],
  { tags: [TAGS.articlesPage, TAGS.articles], revalidate: CACHE_SAFETY_NET_SECONDS },
)

export const getArticle = unstable_cache(
  async (slug: string): Promise<ArticleType | null> => {
    const payload = await client()
    const result = await payload.find({
      collection: 'articles',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      depth: 2,
      limit: 1,
    })
    const article = result.docs[0]
    if (!article) return null

    return {
      ...toArticleCard(article),
      body: article.body ?? '',
      images: toArticleImages(article),
      seo: {
        title: article.seo?.title ?? undefined,
        description: article.seo?.description ?? undefined,
        image: article.seo?.image ? mediaUrl(article.seo.image, 'full') : undefined,
      },
    }
  },
  ['article'],
  { tags: [TAGS.articles], revalidate: CACHE_SAFETY_NET_SECONDS },
)

export const getArticleSlugs = unstable_cache(
  async (): Promise<{ slug: string; publishedAt: string | null }[]> => {
    const payload = await client()
    const result = await payload.find({
      collection: 'articles',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 200,
      select: { slug: true, publishedAt: true },
    })
    return result.docs.map((article) => ({
      slug: article.slug,
      publishedAt: article.publishedAt ?? null,
    }))
  },
  ['article-slugs'],
  { tags: [TAGS.articles], revalidate: CACHE_SAFETY_NET_SECONDS },
)
