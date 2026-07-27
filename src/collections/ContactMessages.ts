import type { CollectionConfig } from 'payload'

/**
 * Messages from the contact form.
 *
 * Written only by the server action, which validates and rate-limits before it
 * gets here. Nothing is publicly readable, and the panel cannot create entries:
 * a message in this collection means someone actually sent it.
 */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Inbox' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'read', 'createdAt'],
    group: 'Inbox',
    description: 'Read-only. Sent from the contact form on the site.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Created through the Local API by the server action, which runs with
    // `overrideAccess`. There is no path to create one from the panel or the
    // public REST API.
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar', readOnly: true },
      fields: [
        { name: 'userAgent', type: 'text' },
        { name: 'referer', type: 'text' },
      ],
    },
  ],
}
