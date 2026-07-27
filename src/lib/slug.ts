import type { Field, FieldHook } from 'payload'

export const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Slug derived from another field, editable afterwards.
 *
 * Slugs are URLs, and a published URL is a promise: it is filled in once from
 * the title and then left alone unless edited by hand. Regenerating it on every
 * title change would silently break links that already exist in the wild.
 */
const fillFromSource =
  (sourceField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    if (operation === 'create' || operation === 'update') {
      const source = data?.[sourceField]
      if (typeof source === 'string' && source.length > 0) return slugify(source)
    }
    return value
  }

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL segment. Filled from the title, safe to edit before publishing.',
  },
  hooks: {
    beforeValidate: [fillFromSource(sourceField)],
  },
})
