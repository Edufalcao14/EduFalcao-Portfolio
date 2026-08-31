import type { GlobalConfig } from 'payload'

import { revalidateOnGlobalChange } from '@/lib/revalidate'
import { noBannedCopy } from '@/lib/validators'

/** The intro copy above the article list. The articles themselves are a collection. */
export const ArticlesPage: GlobalConfig = {
  slug: 'articlesPage',
  label: 'Articles page',
  admin: {
    group: 'Pages',
    livePreview: { url: '/articles' },
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [revalidateOnGlobalChange] },
  fields: [
    {
      name: 'mainText',
      type: 'textarea',
      required: true,
      localized: true,
      validate: noBannedCopy,
      admin: { description: 'What someone finds here and why it is worth their time.' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true, maxLength: 160 },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
