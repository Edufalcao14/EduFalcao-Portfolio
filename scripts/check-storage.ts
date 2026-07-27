/**
 * Verifies the Supabase Storage wiring end to end, without touching the site.
 *
 * Uploads a small file over the S3 protocol, reads it back over the public URL
 * the way a browser would, then deletes it. Those are two different code paths:
 * credentials can be correct while the bucket is still private, and the failure
 * only shows up later as broken images on the live page.
 *
 * Run: npm run check:storage
 */
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const required = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'NEXT_PUBLIC_MEDIA_HOST',
] as const

const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`\nNot configured yet. Missing: ${missing.join(', ')}\n`)
  process.exit(1)
}

const bucket = process.env.S3_BUCKET!
const key = `_healthcheck/${Date.now()}.txt`
const body = 'storage wiring check'

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

const publicUrl = `https://${process.env.NEXT_PUBLIC_MEDIA_HOST}/storage/v1/object/public/${bucket}/${key}`

const main = async () => {
  console.log(`\nBucket:   ${bucket}`)
  console.log(`Endpoint: ${process.env.S3_ENDPOINT}\n`)

  process.stdout.write('1. upload over S3 ......... ')
  await client.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: 'text/plain' }),
  )
  console.log('ok')

  process.stdout.write('2. read back publicly ..... ')
  const response = await fetch(publicUrl)
  if (!response.ok) {
    console.log(`FAILED (HTTP ${response.status})`)
    console.error(
      `\nThe upload worked, so the keys are right, but the object is not publicly readable.\nMake the "${bucket}" bucket public in the dashboard, otherwise every image on the site 404s.\n`,
    )
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    process.exit(1)
  }
  const text = await response.text()
  console.log(text.trim() === body ? 'ok' : `unexpected content: ${text.slice(0, 40)}`)

  process.stdout.write('3. clean up ............... ')
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  console.log('ok')

  console.log('\nStorage is wired correctly. Uploads from the admin panel will land in the bucket.\n')
}

main().catch((error) => {
  console.log('FAILED')
  console.error(`\n${(error as Error).message}\n`)
  process.exit(1)
})
