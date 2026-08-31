import type { GlobalConfig } from 'payload'

import { proseEditor } from '@/fields/richText'
import { revalidateOnGlobalChange } from '@/lib/revalidate'
import { noBannedCopyRichText } from '@/lib/validators'

/**
 * The home page's editable content.
 *
 * There is no block builder here. The frontend renders a fixed hero layout, and
 * a blocks field with no renderer behind it is a control that lies: it would let
 * you reorder sections in the panel and change nothing on the site.
 */
export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Home page',
  admin: {
    group: 'Pages',
    livePreview: { url: '/' },
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, max: 20 },
  hooks: { afterChange: [revalidateOnGlobalChange] },
  fields: [
    {
      name: 'introduction',
      type: 'richText',
      editor: proseEditor,
      required: true,
      localized: true,
      validate: noBannedCopyRichText,
      admin: {
        description:
          'The hero paragraph. First person, short sentences, numbers over adjectives.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: { description: 'Overrides the defaults from Site settings for this page only.' },
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true, maxLength: 160 },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
