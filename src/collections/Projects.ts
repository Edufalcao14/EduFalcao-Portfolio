import type { CollectionConfig } from 'payload'

import { caseEditor } from '@/fields/richText'
import { caseTemplateValue } from '@/fields/caseTemplate'
import { slugField } from '@/lib/slug'
import { revalidateProject } from '@/lib/revalidate'
import {
  noBannedCopy,
  noBannedCopyRichText,
  requireAtLeastOneLink,
} from '@/lib/validators'

/**
 * Case studies. The strongest proof on the site.
 *
 * `proofTier` mirrors the hierarchy of evidence from the positioning doc, and it
 * is not cosmetic: tier 4 (academic work) is rendered in a separate, quiet
 * section and cannot be featured. An evaluator judges a set by its weakest item,
 * so student projects never share a slot with production work.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Case', plural: 'Cases' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'proofTier', 'featured', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) => `/work/${data?.slug ?? ''}`,
    },
  },
  access: {
    // Drafts stay invisible to the public. Only published docs are readable
    // without a session.
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
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProject],
  },
  fields: [
    slugField('title'),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Shows on the home page. Academic work cannot be featured.',
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        if (value === true && data?.proofTier === 'tier4') {
          return 'Academic work is not featured. The site leads with production work.'
        }
        return true
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower comes first. Ties fall back to date.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Case',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              validate: noBannedCopy,
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              localized: true,
              maxLength: 200,
              validate: noBannedCopy,
              admin: {
                description:
                  'One line. Used on the card and as the page meta description, so it has to stand alone.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              editor: caseEditor,
              localized: true,
              defaultValue: caseTemplateValue,
              validate: noBannedCopyRichText,
            },
          ],
        },
        {
          label: 'Facts',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  required: true,
                  defaultValue: 'mobile',
                  options: [
                    { label: 'Mobile app', value: 'mobile' },
                    { label: 'Web', value: 'web' },
                    { label: 'Academic', value: 'academic' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'proofTier',
                  label: 'Proof tier',
                  type: 'select',
                  required: true,
                  defaultValue: 'tier2',
                  options: [
                    { label: '1 — Public app in the stores', value: 'tier1' },
                    { label: '2 — Technical case with a measured number', value: 'tier2' },
                    { label: '3 — Web project with a business result', value: 'tier3' },
                    { label: '4 — Academic or study project', value: 'tier4' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Hierarchy of evidence. Tier 4 renders in its own quiet section.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'company', type: 'text', admin: { width: '50%' } },
                {
                  name: 'role',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. Sole technical owner, Mobile Engineer.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'periodStart',
                  type: 'date',
                  required: true,
                  admin: { width: '50%', date: { pickerAppearance: 'monthOnly' } },
                },
                {
                  name: 'periodEnd',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'monthOnly' },
                    description: 'Empty means ongoing.',
                  },
                },
              ],
            },
            {
              name: 'tech',
              type: 'relationship',
              relationTo: 'technologies',
              hasMany: true,
              required: true,
            },
          ],
        },
        {
          label: 'Links & media',
          fields: [
            {
              name: 'links',
              type: 'group',
              validate: requireAtLeastOneLink,
              admin: {
                description:
                  'At least one is required. A project with no link is not ready to be on the site.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'appStore', label: 'App Store', type: 'text', admin: { width: '50%' } },
                    { name: 'playStore', label: 'Play Store', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'liveUrl', label: 'Live site', type: 'text', admin: { width: '50%' } },
                    { name: 'repoUrl', label: 'Repository', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Served at card resolution. Never the full-size original.' },
            },
            {
              name: 'projectSection',
              label: 'Screenshot sections',
              type: 'array',
              admin: {
                description:
                  'Galleries shown below the case. Public store screens only, per the positioning doc: no internal client screens.',
              },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
