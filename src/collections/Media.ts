import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '@/lib/revalidate'

/**
 * Every image on the site comes from here.
 *
 * `imageSizes` exists to satisfy the performance budget: a thumbnail must be
 * served at thumbnail resolution. The old site shipped 3840px-wide originals
 * into card slots, which is the opposite of what this portfolio claims to do.
 * `alt` is required with no exception.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  // Replacing a file or fixing an alt text changes what the site serves, and the
  // same image can sit on any page, so a media write purges like any other.
  hooks: revalidateHooks,
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: undefined, formatOptions: { format: 'webp' } },
      { name: 'card', width: 960, height: undefined, formatOptions: { format: 'webp' } },
      { name: 'full', width: 1920, height: undefined, formatOptions: { format: 'webp' } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'What the image shows, for screen readers and for when it fails to load. Not a caption.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional. Shown next to the image when the layout has room for it.',
      },
    },
  ],
}
