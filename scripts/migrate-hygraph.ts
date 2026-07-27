/**
 * One-off import of the old Hygraph content.
 *
 * Two rules, both deliberate:
 *
 * 1. Everything lands as a draft. Never published. The positioning doc condemns
 *    most of this copy, so it exists here as raw material to rewrite against, not
 *    as something that can reach the site by forgetting about it.
 *
 * 2. The copy validators are turned off for the run (PAYLOAD_DISABLE_COPY_RULES),
 *    because otherwise nothing would import at all. Instead of failing, the script
 *    reports every banned word it finds, per document and per field. That report is
 *    the rewrite list.
 *
 * Idempotent by slug. Run: npm run migrate:hygraph
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { findCopyOffences } from '../src/lib/validators'
import { slugify } from '../src/lib/slug'

const HYGRAPH_URL = process.env.HYGRAPH_URL
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN

if (!HYGRAPH_URL || !HYGRAPH_TOKEN) {
  console.error(
    'HYGRAPH_URL and HYGRAPH_TOKEN must be set. They are only needed for this import and can be removed afterwards.',
  )
  process.exit(1)
}

if (process.env.PAYLOAD_DISABLE_COPY_RULES !== 'true') {
  console.error(
    'Run this through `npm run migrate:hygraph`, which sets PAYLOAD_DISABLE_COPY_RULES. Nothing from the old site passes the copy rules.',
  )
  process.exit(1)
}

/** The queries as they existed on the old site, kept in scripts/legacy. */
const PROJECTS_QUERY = `
  query {
    project(where: { slug: "projects" }) {
      mainText
      projectCard {
        slug
        projectName
        projectDescription
        githubUrl
        liveUrl
        thumbPhoto { url }
        projectSection { title image { url } }
        technology { name }
      }
    }
  }
`

type HygraphProject = {
  slug: string
  projectName: string
  projectDescription: string
  githubUrl?: string | null
  liveUrl?: string | null
  thumbPhoto?: { url: string } | null
  projectSection?: { title: string; image: { url: string }[] }[]
  technology?: { name: string }[]
}

const fetchHygraph = async <T>(query: string): Promise<T> => {
  const response = await fetch(HYGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) throw new Error(`Hygraph responded ${response.status}`)

  const json = (await response.json()) as { data?: T; errors?: { message: string }[] }
  // The old helper destructured `data` and ignored `errors`, which turned a
  // schema mismatch into an undefined further down the stack.
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  if (!json.data) throw new Error('Hygraph returned no data')

  return json.data
}

const payload = await getPayload({ config })

const offences: { doc: string; field: string; terms: string[] }[] = []

const audit = (doc: string, field: string, text?: string | null) => {
  if (!text) return
  const found = findCopyOffences(text)
  if (found.length > 0) {
    offences.push({ doc, field, terms: found.map((o) => o.term) })
  }
}

/** Downloads an asset from graphassets and stores it through Payload. */
const importAsset = async (url: string, alt: string) => {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]

  const response = await fetch(url)
  if (!response.ok) {
    console.warn(`  ! asset failed (${response.status}): ${url}`)
    return null
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const name = url.split('/').pop() || 'asset'
  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  const extension = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : 'jpg'

  return payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt },
    file: {
      data: buffer,
      name: name.includes('.') ? name : `${name}.${extension}`,
      mimetype: contentType,
      size: buffer.byteLength,
    },
  })
}

const ensureTechnology = async (name: string) => {
  const existing = await payload.find({
    collection: 'technologies',
    where: { name: { equals: name } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const created = await payload.create({
    collection: 'technologies',
    overrideAccess: true,
    data: { name, slug: slugify(name), category: 'web' },
  })
  return created.id
}

/** Plain paragraphs. The old rich text is being rewritten anyway. */
const asLexical = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: text
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((chunk) => ({
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: chunk.trim(),
            version: 1,
          },
        ],
      })),
  },
})

const main = async () => {
  console.log('\nImporting from Hygraph. Everything lands as a draft.\n')

  const data = await fetchHygraph<{ project: { projectCard: HygraphProject[] } }>(PROJECTS_QUERY)
  const cards = data.project?.projectCard ?? []
  console.log(`Found ${cards.length} projects\n`)

  for (const card of cards) {
    const slug = slugify(card.slug || card.projectName)
    console.log(`- ${card.projectName} (${slug})`)

    audit(card.projectName, 'projectName', card.projectName)
    audit(card.projectName, 'projectDescription', card.projectDescription)

    const thumbnail = card.thumbPhoto?.url
      ? await importAsset(card.thumbPhoto.url, `${card.projectName} thumbnail`)
      : null

    if (!thumbnail) {
      console.warn('  ! skipped: a case cannot be created without a thumbnail')
      continue
    }

    const techIds = await Promise.all(
      (card.technology ?? []).map((tech) => ensureTechnology(tech.name)),
    )

    const summary = (card.projectDescription ?? '').slice(0, 200)

    const payloadData = {
      title: card.projectName,
      slug,
      summary,
      body: asLexical(card.projectDescription ?? ''),
      kind: 'web' as const,
      // Imported content has not been triaged yet. Tier 2 is a holding value,
      // and the doc's hierarchy gets applied by hand during the rewrite.
      proofTier: 'tier2' as const,
      periodStart: new Date().toISOString(),
      tech: techIds,
      links: {
        repoUrl: card.githubUrl ?? undefined,
        liveUrl: card.liveUrl ?? undefined,
      },
      thumbnail: thumbnail.id,
      _status: 'draft' as const,
    }

    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        data: payloadData,
        draft: true,
        overrideAccess: true,
      })
      console.log('  updated draft')
    } else {
      await payload.create({
        collection: 'projects',
        data: payloadData,
        draft: true,
        overrideAccess: true,
      })
      console.log('  created draft')
    }

    // The old site had sections of screenshots. They are imported as media so
    // nothing is lost, but the doc restricts case images to public store
    // screens, so they are not attached to the body automatically.
    for (const section of card.projectSection ?? []) {
      audit(card.projectName, `section: ${section.title}`, section.title)
      for (const [index, image] of (section.image ?? []).entries()) {
        await importAsset(image.url, `${card.projectName} ${section.title} ${index + 1}`)
      }
    }
  }

  console.log('\n─────────────────────────────────────────')
  console.log('REWRITE LIST: banned copy found in the import')
  console.log('─────────────────────────────────────────')

  if (offences.length === 0) {
    console.log('Nothing flagged.')
  } else {
    for (const offence of offences) {
      console.log(`\n${offence.doc}`)
      console.log(`  ${offence.field}: ${offence.terms.join(', ')}`)
    }
    console.log(
      `\n${offences.length} field(s) to rewrite. The validators are active again outside this script, so none of these can be published as-is.`,
    )
  }

  console.log('\nDone. Nothing was published.\n')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
