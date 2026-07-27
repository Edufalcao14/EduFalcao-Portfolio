import type { GlobalConfig } from 'payload'

import { proseEditor } from '@/fields/richText'
import { revalidateResume } from '@/lib/revalidate'
import { noBannedCopy, noBannedCopyRichText } from '@/lib/validators'

/**
 * Copy for the resume page. The lists it introduces (experience, education,
 * skills) come from their own collections, so this global only holds the prose
 * that sits above each one.
 */
export const ResumePage: GlobalConfig = {
  slug: 'resumePage',
  label: 'Resume page',
  admin: {
    group: 'Pages',
    livePreview: { url: '/resume' },
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, max: 20 },
  hooks: { afterChange: [revalidateResume] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About me',
          fields: [
            {
              name: 'aboutMeText',
              type: 'richText',
              editor: proseEditor,
              required: true,
              localized: true,
              validate: noBannedCopyRichText,
            },
          ],
        },
        {
          label: 'Intros',
          fields: [
            {
              name: 'educationText',
              type: 'textarea',
              localized: true,
              validate: noBannedCopy,
              admin: { description: 'Sits above the education list.' },
            },
            {
              name: 'skillText',
              type: 'textarea',
              localized: true,
              validate: noBannedCopy,
              admin: { description: 'Sits above the skills grid.' },
            },
            {
              name: 'experienceText',
              type: 'textarea',
              localized: true,
              validate: noBannedCopy,
              admin: { description: 'Sits beside the experience timeline.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seo', type: 'group', fields: [
              { name: 'title', type: 'text', localized: true },
              { name: 'description', type: 'textarea', localized: true, maxLength: 160 },
              { name: 'image', type: 'upload', relationTo: 'media' },
            ] },
          ],
        },
      ],
    },
  ],
}
