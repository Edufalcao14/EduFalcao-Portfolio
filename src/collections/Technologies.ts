import type { CollectionConfig } from 'payload'

import { revalidateResumeSource } from '@/lib/revalidate'
import { slugField } from '@/lib/slug'

/**
 * The stack, as data rather than as a hardcoded list.
 *
 * `highlight` is the field that does real work: it separates the technologies
 * that differentiate him (New Architecture, Reanimated, Maestro, Fastlane on a
 * self-hosted runner, Sentry, offline-first) from the ones every candidate
 * lists. The skills section leads with the highlighted ones.
 */
export const Technologies: CollectionConfig = {
  slug: 'technologies',
  labels: { singular: 'Technology', plural: 'Technologies' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'highlight'],
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
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'mobile',
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Web & backend', value: 'web' },
        { label: 'Tooling & delivery', value: 'tooling' },
      ],
    },
    {
      // The column is still called `highlight` from an earlier iteration.
      // Renaming it would mean a destructive schema change, and this database
      // already holds a real admin account, so the label carries the meaning.
      name: 'highlight',
      label: 'Show in skills grid',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Appears in the skills grid on the resume page. Needs an icon below to render.',
      },
    },
    {
      /**
       * Which side of a project this sits on, used to group the badges on a
       * case page. Separate from `category`, which answers a different question:
       * `category` splits the skills grid on the resume by platform (mobile /
       * web / tooling), while a case page wants the stack read as frontend
       * against backend. TanStack Query is the example that proves they are not
       * the same axis: its category is mobile and it is frontend here.
       *
       * Optional on purpose. An unset technology still renders, just ungrouped,
       * so adding this field could not blank out an existing case.
       */
      name: 'layer',
      type: 'select',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Tooling', value: 'tooling' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Groups the badges on a case page. Leave empty to render it ungrouped.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description:
          'Position in the skills grid. Lower comes first; entries without a number fall to the end, alphabetically.',
      },
    },
    {
      name: 'iconSvg',
      type: 'code',
      admin: {
        language: 'html',
        description:
          'Inline SVG markup, shown in the skills grid. Sanitised before injection.',
      },
    },
  ],
}
