/** One image an article references, keyed by the filename used in the body. */
export type ArticleImage = {
  filename: string
  url: string
  alt: string
  width?: number
  height?: number
  mimeType?: string
}

export type ArticleCardType = {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  /** Whole minutes, computed from the body. Never zero: a one-line note is "1 min". */
  readingMinutes: number
  topics: string[]
  cover?: { url: string; alt: string; mimeType?: string }
}

export type ArticleType = ArticleCardType & {
  /** Raw markdown. Rendered by `src/components/markdown`. */
  body: string
  /** Resolved once here so the renderer never touches the database. */
  images: ArticleImage[]
  seo: {
    title?: string
    description?: string
    image?: string
  }
}

export type ArticlesPageInfo = {
  mainText: string
  articles: ArticleCardType[]
}
