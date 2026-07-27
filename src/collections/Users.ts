import type { CollectionConfig } from 'payload'

/**
 * Single-admin auth. There is exactly one editor of this site.
 *
 * `create` is closed once the first user exists: the very first signup is
 * allowed so the admin panel is reachable on a fresh database, and from then on
 * nobody can register. That keeps a publicly-reachable /admin from being an
 * open door without needing a seed script to run before first boot.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 15,
  },
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  access: {
    create: async ({ req }) => {
      const existing = await req.payload.count({ collection: 'users' })
      return existing.totalDocs === 0
    },
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
