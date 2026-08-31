import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * On-demand revalidation instead of a fixed ISR window.
 *
 * The old site refetched the CMS every eight hours, which meant a typo fix could
 * sit live for most of a day. Publishing in the panel now updates the site.
 *
 * The purge is deliberately total rather than surgical: one edit drops every
 * cached query and every route. A per-entity map looks tidier but it is wrong
 * the moment content crosses a boundary — a technology renamed shows up on the
 * resume *and* on every case card, and a replaced image shows up wherever that
 * image is used. This site has a handful of pages and one author, so the cost of
 * over-purging is a few re-renders, while the cost of under-purging is stale
 * content nobody notices until it embarrasses.
 */

/** Every tag `content.ts` caches under. Keep the two in sync. */
export const TAGS = {
  home: 'home',
  resume: 'resume',
  projectsPage: 'projects-page',
  settings: 'settings',
  projects: 'projects',
  articlesPage: 'articles-page',
  articles: 'articles',
} as const

/**
 * Payload hooks also run from standalone scripts (seed, Hygraph import), where
 * there is no Next request context and `revalidateTag` throws. There is nothing
 * to revalidate in that situation, so a failure here is expected and ignored
 * rather than allowed to abort the write that triggered it.
 */
const purgeEverything = (label: string, logger?: { info: (msg: string) => void }) => {
  try {
    for (const tag of Object.values(TAGS)) revalidateTag(tag, 'max')
    // 'layout' at the root covers every page below it, dynamic case pages
    // included, so no route has to be named individually.
    revalidatePath('/', 'layout')
    logger?.info(`Revalidated everything after ${label}`)
  } catch {
    // Outside a Next runtime. No cache to purge.
  }
}

/**
 * Autosave fires afterChange every couple of seconds while typing. Purging on
 * each keystroke would rebuild the whole site for content that is not public
 * yet, so a draft that was already a draft is left alone. Every other
 * transition purges — including publish → draft, which has to drop the version
 * still being served.
 */
export const revalidateOnChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  previousDoc,
  req,
}) => {
  const stillUnpublished = doc?._status === 'draft' && previousDoc?._status === 'draft'
  if (!stillUnpublished) purgeEverything(`change to ${collection.slug}`, req?.payload?.logger)
  return doc
}

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ collection, doc, req }) => {
  purgeEverything(`delete from ${collection.slug}`, req?.payload?.logger)
  return doc
}

export const revalidateOnGlobalChange: GlobalAfterChangeHook = ({ doc, global, req }) => {
  purgeEverything(`change to ${global?.slug ?? 'a global'}`, req?.payload?.logger)
  return doc
}

/** Wire once, on every collection whose content can reach the site. */
export const revalidateHooks: CollectionConfig['hooks'] = {
  afterChange: [revalidateOnChange],
  afterDelete: [revalidateOnDelete],
}
