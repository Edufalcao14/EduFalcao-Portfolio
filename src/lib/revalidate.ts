import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * On-demand revalidation instead of a fixed ISR window.
 *
 * The old site refetched the CMS every eight hours, which meant a typo fix could
 * sit live for most of a day. Publishing in the panel now updates the site.
 */

/**
 * Payload hooks also run from standalone scripts (seed, Hygraph import), where
 * there is no Next request context and `revalidateTag` throws. There is nothing
 * to revalidate in that situation, so a failure here is expected and ignored
 * rather than allowed to abort the write that triggered it.
 */
const safely = (action: () => void) => {
  try {
    action()
  } catch {
    // Outside a Next runtime. No cache to purge.
  }
}

export const TAGS = {
  home: 'home',
  resume: 'resume',
  projectsPage: 'projects-page',
  settings: 'settings',
  projects: 'projects',
  project: (slug: string) => `project-${slug}`,
} as const

export const revalidateProject: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({
  doc,
  req,
}) => {
  // Autosave fires this hook constantly while typing; drafts are not on the
  // public site, so there is nothing to revalidate until it is published.
  if (doc?._status === 'draft') return doc

  safely(() => {
    revalidateTag(TAGS.projects, 'max')
    revalidateTag(TAGS.projectsPage, 'max')
    if (typeof doc?.slug === 'string') {
      revalidateTag(TAGS.project(doc.slug), 'max')
      revalidatePath(`/projects/${doc.slug}`)
    }
    revalidatePath('/')
    revalidatePath('/projects')
    req?.payload?.logger?.info(`Revalidated project ${doc?.slug ?? '(unknown)'}`)
  })
  return doc
}

export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  safely(() => {
    revalidateTag(TAGS.home, 'max')
    revalidatePath('/')
  })
  return doc
}

export const revalidateResume: GlobalAfterChangeHook = ({ doc }) => {
  safely(() => {
    revalidateTag(TAGS.resume, 'max')
    revalidatePath('/resume')
  })
  return doc
}

export const revalidateProjectsPage: GlobalAfterChangeHook = ({ doc }) => {
  safely(() => {
    revalidateTag(TAGS.projectsPage, 'max')
    revalidatePath('/projects')
  })
  return doc
}

/** Settings touch every page: the email, the socials, the SEO defaults. */
export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  safely(() => {
    revalidateTag(TAGS.settings, 'max')
    revalidatePath('/', 'layout')
  })
  return doc
}

/** Experiences, education and technologies feed the resume page. */
export const revalidateResumeSource: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({
  doc,
}) => {
  safely(() => {
    revalidateTag(TAGS.resume, 'max')
    revalidatePath('/resume')
  })
  return doc
}
