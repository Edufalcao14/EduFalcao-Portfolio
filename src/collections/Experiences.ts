import type { CollectionConfig } from 'payload'

import { proseEditor } from '@/fields/richText'
import { revalidateResumeSource } from '@/lib/revalidate'
import { noBannedCopy, noBannedCopyRichText, noJuniorTitle } from '@/lib/validators'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experience' },
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'startDate', 'endDate'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateResumeSource],
    afterDelete: [revalidateResumeSource],
  },
  defaultSort: '-startDate',
  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
      validate: noJuniorTitle,
      admin: { description: 'Exactly as it reads on the CV. Divergence costs credibility.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'location',
          type: 'text',
          admin: { width: '50%', description: 'e.g. Brussels, Belgium.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'monthOnly' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'monthOnly' },
            description: 'Empty means present.',
          },
        },
      ],
    },
    {
      name: 'employmentType',
      type: 'select',
      defaultValue: 'fullTime',
      options: [
        { label: 'Full time', value: 'fullTime' },
        { label: 'Part time', value: 'partTime' },
        { label: 'Freelance', value: 'freelance' },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      editor: proseEditor,
      localized: true,
      validate: noBannedCopyRichText,
      admin: { description: 'What you owned and what changed because of it. Numbers over adjectives.' },
    },
    {
      /**
       * One role, several products. Mirrors how the CV reads: the role sets the
       * context, then each product gets its own name, descriptor and bullets.
       */
      name: 'projects',
      label: 'Projects in this role',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Drag to reorder. Each one renders as its own block under the role.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Golden Palace Casino' },
        },
        {
          name: 'descriptor',
          type: 'text',
          localized: true,
          admin: {
            description:
              'What it is, in a few words. e.g. "React Native app (iOS & Android, fintech)".',
          },
        },
        {
          name: 'bullets',
          type: 'richText',
          editor: proseEditor,
          localized: true,
          validate: noBannedCopyRichText,
          admin: {
            description:
              'What you shipped and what changed because of it. Lead with the verb, close with the number.',
          },
        },
        {
          name: 'case',
          type: 'relationship',
          relationTo: 'projects',
          admin: { description: 'Optional link to a full case study.' },
        },
      ],
    },
    {
      name: 'tech',
      label: 'Stack',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      admin: {
        description: 'Rendered as the stack line for this role.',
      },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { description: 'Cases that came out of this role. Links the timeline to the proof.' },
    },
    {
      name: 'summary',
      type: 'text',
      localized: true,
      validate: noBannedCopy,
      admin: { description: 'Optional one-liner for compact layouts.' },
    },
  ],
}
