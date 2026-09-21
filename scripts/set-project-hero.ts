/**
 * Uploads a file and makes it a project's thumbnail (the hero media).
 *
 * Runs through the Payload local API rather than raw SQL so the file lands in
 * the bucket through the S3 plugin, exactly like the rest of the case's media.
 * A video gets no `sizes` derivatives, which is fine: every renderer falls back
 * to the original URL and branches on the mime type.
 *
 * Idempotent. The media row is matched by `alt`, so a second run replaces
 * nothing and simply re-points the thumbnail.
 *
 * Run: npm run set:hero -- <slug> <path-to-file> "<alt text>"
 * e.g. npm run set:hero -- deentz media-temp/deentz-teaser.mp4 "Screen recording of Deentz: the dashboard, the schedule and the copilot answering a question"
 */
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

const [SLUG, FILE, ALT] = process.argv.slice(2)
if (!SLUG || !FILE || !ALT) {
  throw new Error('Usage: set:hero -- <slug> <path-to-file> "<alt text>"')
}

const uri = process.env.DATABASE_URI ?? ''
console.log(`  database: ${uri.replace(/:\/\/[^@]*@/, '://***@')}`)
console.log(`  NODE_ENV: ${process.env.NODE_ENV} (schema push is off unless "development")`)
if (process.env.NODE_ENV === 'development') {
  throw new Error('Refusing to run with NODE_ENV=development: that turns schema push on.')
}

const payload = await getPayload({ config })

const found = await payload.find({
  collection: 'media',
  where: { alt: { equals: ALT } },
  limit: 1,
  overrideAccess: true,
})

let mediaId = found.docs[0]?.id as number | undefined
if (mediaId) {
  console.log(`  ${FILE} already uploaded as id ${mediaId}`)
} else {
  const created = await payload.create({
    collection: 'media',
    data: { alt: ALT },
    filePath: path.resolve(process.cwd(), FILE),
    overrideAccess: true,
  })
  mediaId = created.id as number
  console.log(`  ${FILE} uploaded as ${created.url} (mime ${created.mimeType})`)
}

const project = await payload.find({
  collection: 'projects',
  where: { slug: { equals: SLUG } },
  limit: 1,
  overrideAccess: true,
})
const doc = project.docs[0]
if (!doc) throw new Error(`No project with slug "${SLUG}".`)

await payload.update({
  collection: 'projects',
  id: doc.id,
  data: { thumbnail: mediaId } as never,
  overrideAccess: true,
})

console.log(`  ${SLUG} thumbnail set to media ${mediaId}`)
process.exit(0)
