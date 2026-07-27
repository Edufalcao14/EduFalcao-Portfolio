import type { GlobalConfig } from 'payload'

import { revalidateProjectsPage } from '@/lib/revalidate'
import { noBannedCopy } from '@/lib/validators'

/** The intro copy above the project list. The cases themselves are a collection. */
export const ProjectsPage: GlobalConfig = {
  slug: 'projectsPage',
  label: 'Projects page',
  admin: {
    group: 'Pages',
    livePreview: { url: '/projects' },
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [revalidateProjectsPage] },
  fields: [
    {
      name: 'mainText',
      type: 'textarea',
      required: true,
      localized: true,
      validate: noBannedCopy,
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
