import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '@/lib/revalidate'
import { noBannedCopy } from '@/lib/validators'

export const Education: CollectionConfig = {
  slug: 'education',
  labels: { singular: 'Education entry', plural: 'Education' },
  admin: {
    useAsTitle: 'degree',
    defaultColumns: ['degree', 'institution', 'startDate', 'endDate'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: revalidateHooks,
  defaultSort: '-startDate',
  fields: [
    { name: 'degree', type: 'text', required: true, localized: true },
    { name: 'institution', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'monthOnly' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    {
      name: 'hours',
      type: 'number',
      admin: {
        description: 'For courses measured in hours instead of dates. Shown only when no dates exist.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      validate: noBannedCopy,
    },
  ],
}
