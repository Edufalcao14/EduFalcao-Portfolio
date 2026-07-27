import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'

import { ContactMessages } from './collections/ContactMessages'
import { Education } from './collections/Education'
import { Experiences } from './collections/Experiences'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Technologies } from './collections/Technologies'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { ProjectsPage } from './globals/ProjectsPage'
import { ResumePage } from './globals/ResumePage'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Supabase Storage speaks the S3 API, so the official S3 adapter drives it.
 * Enabled only when the credentials exist: local development falls back to
 * writing into the filesystem, so the project boots on a clean checkout with
 * nothing but a Postgres container.
 */
/**
 * Public object base for the bucket.
 *
 * The adapter's default URL is `endpoint/bucket/key`, which points at the S3 API
 * path and needs a signed request, so a browser fetching it gets a 403. Public
 * objects live under a different path entirely, and that is the one the page has
 * to load.
 */
const publicObjectBase =
  process.env.NEXT_PUBLIC_MEDIA_HOST && process.env.S3_BUCKET
    ? `https://${process.env.NEXT_PUBLIC_MEDIA_HOST}/storage/v1/object/public/${process.env.S3_BUCKET}`
    : null

const storagePlugins: Plugin[] =
  process.env.S3_BUCKET && process.env.S3_ENDPOINT
    ? [
        s3Storage({
          collections: {
            media: publicObjectBase
              ? {
                  // Serve straight from the CDN instead of proxying every image
                  // through the Next server. The performance budget does not
                  // have room for the extra hop.
                  disablePayloadAccessControl: true,
                  generateFileURL: ({ filename, prefix }) =>
                    [publicObjectBase, prefix, filename].filter(Boolean).join('/'),
                }
              : true,
          },
          bucket: process.env.S3_BUCKET,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION ?? 'us-east-1',
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
            },
          },
        }),
      ]
    : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '· Eduardo Falcão',
      robots: 'noindex, nofollow',
    },
  },
  collections: [Projects, Technologies, Experiences, Education, Media, ContactMessages, Users],
  globals: [HomePage, ProjectsPage, ResumePage, SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    push: process.env.NODE_ENV === 'development',
  }),
  /**
   * Localization is on from day one with a single exposed locale. Turning it on
   * later would mean migrating live content into Payload's `_locales` tables;
   * adding 'pt-BR' now costs one line here instead.
   */
  localization: {
    locales: ['en'],
    defaultLocale: 'en',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [...storagePlugins],
})
