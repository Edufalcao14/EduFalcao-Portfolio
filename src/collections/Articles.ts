import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '@/lib/revalidate'
import { slugField } from '@/lib/slug'
import { noBannedCopy } from '@/lib/validators'

/**
 * Articles. Markdown in, rendered page out.
 *
 * The body is a `code` field rather than a rich text field on purpose. Every
 * other long-form field on this site is Lexical, but an article has to survive
 * being written somewhere else and pasted in whole, and it has to carry diagrams
 * and code that a restricted Lexical toolbar cannot express. Markdown is the
 * format that does both, and `code` gives it a monospace editor instead of a
 * textarea.
 *
 * What the renderer supports is documented in `docs/writing-articles.md`, and
 * the same guide is on the field itself behind the ⓘ toggle. A syntax the panel
 * offers but the page cannot render is a control that lies.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) => `/articles/${data?.slug ?? ''}`,
    },
  },
  access: {
    // Drafts stay invisible to the public, exactly as cases do.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
      schedulePublish: false,
    },
    maxPerDoc: 20,
  },
  hooks: revalidateHooks,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, validate: noBannedCopy },
    slugField('title'),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      validate: noBannedCopy,
      admin: {
        description:
          'Two or three sentences. Shown on the article list and used as the search-result description, so write it for someone deciding whether to click.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Sets the dateline and the order of the list.',
      },
    },
    {
      name: 'body',
      type: 'code',
      required: true,
      localized: true,
      admin: {
        language: 'markdown',
        components: {
          Description: '/components/cms/markdown-help#MarkdownHelp',
        },
      },
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Every image and drawing this article references. Attach it here first, then reference it in the body by filename: ![alt](media:filename.svg).',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional. The list card and the social preview image.',
      },
    },
    {
      name: 'topics',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Topic', plural: 'Topics' },
      admin: {
        description: 'Two or three, lowercase, existing words. Chips on the card, nothing more.',
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      admin: {
        description: 'Leave empty and the title and summary above are used, which is usually right.',
      },
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true, maxLength: 160 },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
