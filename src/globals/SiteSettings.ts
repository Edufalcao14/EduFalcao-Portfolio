import type { GlobalConfig } from 'payload'

import { revalidateOnGlobalChange } from '@/lib/revalidate'
import { noBannedCopy } from '@/lib/validators'

/**
 * One email address for the whole site.
 *
 * The old site had the address typed in three places and they had already
 * drifted. There is now exactly one field for it, and every template reads from
 * here, so divergence between site, CV and LinkedIn is impossible by design.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site settings',
  admin: { group: 'System' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [revalidateOnGlobalChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'name', type: 'text', required: true, defaultValue: 'Eduardo Sampaio Falcão' },
            {
              name: 'headline',
              type: 'text',
              required: true,
              localized: true,
              validate: noBannedCopy,
              admin: { description: 'e.g. "Mobile Engineer · React Native & Expo".' },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              admin: {
                description:
                  'The only email on the site. Must match the CV, LinkedIn and GitHub exactly.',
              },
            },
            {
              name: 'availability',
              type: 'group',
              fields: [
                { name: 'location', type: 'text', required: true },
                {
                  name: 'from',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'monthOnly' } },
                },
                {
                  name: 'note',
                  type: 'text',
                  localized: true,
                  admin: { description: 'e.g. "Authorised to work in Brazil".' },
                },
              ],
            },
          ],
        },
        {
          label: 'Links',
          fields: [
            {
              name: 'socials',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
                {
                  name: 'iconSvg',
                  type: 'code',
                  admin: {
                    language: 'html',
                    description:
                      'Inline SVG markup. Sanitised before it is injected, so paste the icon source directly.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            {
              name: 'defaultTitle',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              required: true,
              localized: true,
              maxLength: 160,
              validate: noBannedCopy,
              admin: {
                description:
                  'Per-page descriptions override this. The old site shipped "Portfolio" on all four pages.',
              },
            },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
