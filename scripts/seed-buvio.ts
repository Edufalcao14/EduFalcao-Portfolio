/**
 * Seeds the Buvio case study, with its media. Same shape as seed-deentz.ts.
 *
 * Idempotent: media matched by `alt`, the case by slug.
 *
 * Run: npm run seed:buvio
 */
import { readdir } from 'node:fs/promises'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

const MEDIA_DIR = process.env.BUVIO_MEDIA_DIR ?? path.resolve(process.cwd(), 'media-temp/buvio')

const announceTarget = () => {
  const uri = process.env.DATABASE_URI ?? ''
  console.log(`  database: ${uri.replace(/:\/\/[^@]*@/, '://***@')}`)
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`)
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Refusing to run with NODE_ENV=development: that turns schema push on.')
  }
}

announceTarget()

const payload = await getPayload({ config })
const log = (message: string) => console.log(`  ${message}`)

type Layer = 'frontend' | 'backend' | 'tooling'

/** Existing rows by slug. `layer` is only written when the row has none. */
const TECH: { slug: string; layer: Layer }[] = [
  { slug: 'react-native', layer: 'frontend' },
  { slug: 'expo', layer: 'frontend' },
  { slug: 'reanimated', layer: 'frontend' },
  { slug: 'apollo-client', layer: 'frontend' },
  { slug: 'graphql', layer: 'backend' },
  { slug: 'node-js', layer: 'backend' },
  { slug: 'express', layer: 'backend' },
  { slug: 'postgresql', layer: 'backend' },
  { slug: 'kysely-query-builder', layer: 'backend' },
  { slug: 'firebase-auth', layer: 'backend' },
  { slug: 'typescript', layer: 'tooling' },
  { slug: 'maestro', layer: 'tooling' },
  { slug: 'sentry', layer: 'tooling' },
  { slug: 'github-actions', layer: 'tooling' },
  { slug: 'docker', layer: 'tooling' },
]

const resolveTech = async (): Promise<number[]> => {
  const ids: number[] = []
  for (const { slug, layer } of TECH) {
    const found = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const existing = found.docs[0]
    if (!existing) throw new Error(`Technology "${slug}" is missing.`)
    if (!existing.layer) {
      await payload.update({
        collection: 'technologies',
        id: existing.id,
        data: { layer },
        overrideAccess: true,
      })
      log(`tech ${existing.name} set to ${layer}`)
    }
    ids.push(existing.id as number)
  }
  return ids
}

type MediaSpec = { file: string; alt: string; caption?: string }

const MEDIA: MediaSpec[] = [
  {
    file: 'Buvio-showcase.mp4',
    alt: 'Screen recording of Buvio: creating a match, casting a ballot, watching the live tally and the verdict',
  },
  {
    file: '08b-vote-ballot.png',
    alt: 'Buvio ballot, step one of two: a grid of teammates asking who was the Top, with one selected',
    caption: 'One pick, and never yourself. The rule lives in the entity, not only in the button.',
  },
  {
    file: '09-vote-live.png',
    alt: 'Buvio live vote screen with a countdown, three of eight ballots cast and the running tally per player',
    caption: 'Every ballot pushes the whole session over a WebSocket subscription.',
  },
  {
    file: '10-vote-tally.png',
    alt: 'Buvio live tally with Top and Flop bars per player and the admin button to close the vote',
    caption: 'Only the player who opened the session sees the close button.',
  },
  {
    file: '11-verdict.png',
    alt: 'Buvio verdict screen naming the Top of the night in a gold medallion and the Flop below it, with the final tally',
    caption: 'A closed session is immutable. There is no half verdict.',
  },
  {
    file: '05-history.png',
    alt: 'Buvio match history with counts of matches, verdicts and open votes, and cards tagged upcoming, vote open or finished',
  },
  {
    file: '06-standings.png',
    alt: 'Buvio standings with a personal season summary and a podium of the players with the most Tops',
    caption: 'Counted on closed votes only. A running tally never moves the table.',
  },
  {
    file: '04-matches.png',
    alt: 'Buvio matches tab for a team, showing an upcoming tournament card and a create button',
  },
  {
    file: '07-create-match.png',
    alt: 'Buvio new match form with name, match type, a date strip and the roster included by default',
    caption: 'The whole roster is in by default, so scheduling stays under a minute.',
  },
  { file: '03-welcome.png', alt: 'Buvio welcome screen offering to create a team or join one' },
  { file: '03b-create-team.png', alt: 'Buvio create team form with name, sport and crest picker' },
  { file: '08-join-team.png', alt: 'Buvio join team screen with the invite code input' },
  { file: '01-signup.png', alt: 'Buvio sign-up form with name, nickname, email, password and avatar' },
  {
    file: '01b-signup-validation.png',
    alt: 'Buvio sign-up form showing inline validation errors under the fields',
    caption: 'Zod on the phone and Joi on the server. The API returns codes, the app owns the wording.',
  },
  { file: '02-signin.png', alt: 'Buvio sign-in screen' },
  { file: '12-settings.png', alt: 'Buvio settings with profile, nickname, avatar and sign-out' },
  { file: '13-settings-team.png', alt: 'Buvio team settings with the invite code, crest and leave team' },
]

const uploadMedia = async (): Promise<Map<string, number>> => {
  const present = new Set(await readdir(MEDIA_DIR))
  const missing = MEDIA.filter((e) => !present.has(e.file)).map((e) => e.file)
  if (missing.length > 0) throw new Error(`Missing in ${MEDIA_DIR}: ${missing.join(', ')}`)

  const ids = new Map<string, number>()
  for (const entry of MEDIA) {
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: entry.alt } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]) {
      ids.set(entry.file, found.docs[0].id as number)
      log(`${entry.file} already uploaded`)
      continue
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: entry.alt, caption: entry.caption },
      filePath: path.join(MEDIA_DIR, entry.file),
      overrideAccess: true,
    })
    ids.set(entry.file, created.id as number)
    log(`${entry.file} uploaded as ${created.url}`)
  }
  return ids
}

const SECTIONS: { title: string; description: string; files: string[] }[] = [
  {
    title: 'The vote, live',
    description:
      'Two steps, Top then Flop, then a live count pushed by a graphql-ws subscription on every ballot. The admin can close early. A deadline is closed by an idempotent sweeper on the server, so nobody has to keep the app open.',
    files: ['Buvio-showcase.mp4', '08b-vote-ballot.png', '09-vote-live.png', '10-vote-tally.png'],
  },
  {
    title: 'The verdict and the memory',
    description:
      'A session that closed without votes in both categories has no verdict. Standings count closed sessions only, on two podiums, best first, so a lopsided tally never leaks into the table.',
    files: ['11-verdict.png', '05-history.png', '06-standings.png'],
  },
  {
    title: 'Matches and the squad',
    description:
      'Join by a five-character code or create a team with a crest. A new match takes the whole roster by default. The code is guessable on purpose, which is why the API rate-limits it per IP.',
    files: ['04-matches.png', '07-create-match.png', '03-welcome.png', '03b-create-team.png', '08-join-team.png'],
  },
  {
    title: 'Account and settings',
    description:
      'Session tokens moved from AsyncStorage to the Keychain and Keystore, with a one-time migration so nobody was signed out. Logout clears the credential, the Apollo cache and the socket. Avatars resize on the phone before a presigned upload to R2.',
    files: ['01-signup.png', '01b-signup-validation.png', '02-signin.png', '12-settings.png', '13-settings-team.png'],
  },
]

const METRICS = [
  {
    value: '271',
    label: 'Automated tests across app and API',
    method:
      'Counted it() blocks in both repositories on 20 Sep 2026: 119 in the Expo app (React Native Testing Library over ViewModels and screens) and 152 in the API (Jest, with repository tests against a real Postgres via Testcontainers).',
  },
  {
    value: '10 s',
    label: 'Deadline sweep interval',
    method:
      'Interval of voting-session-sweeper.ts on the API. The sweep is idempotent: concurrent sweeps close a session exactly once and the losers get null.',
  },
  {
    value: '< 1 MB',
    label: 'Every avatar and crest upload',
    method:
      'useImageUpload resizes to 512 px on the device and walks down a JPEG quality ladder until the file is under 1 MB, before the presigned PUT to Cloudflare R2.',
  },
  {
    value: '7',
    label: 'Maestro flows over the real journeys',
    method:
      'Flow files in .maestro/: sign up, sign in, create a team, join by code, browse the tabs, copy the code, cast a ballot. Run on an Android emulator in GitHub Actions, advisory only, since CI has no backend to reach.',
  },
]

const seedCase = async () => {
  const tech = await resolveTech()
  const media = await uploadMedia()
  const id = (file: string): number => {
    const found = media.get(file)
    if (!found) throw new Error(`No media id for ${file}`)
    return found
  }

  const data = {
    title: 'Buvio',
    slug: 'buvio',
    summary:
      'A React Native app for amateur football squads: play the match, then crown the Top and roast the Flop of the night. Expo on iOS and Android over a GraphQL API on Node and Postgres.\n\nThe vote runs live over a WebSocket subscription. A session closes by admin, by deadline or by unanimity, and a verdict, once written, never changes. Tokens live in the Keychain and Keystore, pictures resize on the phone before a presigned upload, and both repositories ship with tests, Maestro flows and CI.',
    body: null,
    kind: 'mobile' as const,
    proofTier: 'tier2' as const,
    company: 'Buvio',
    role: 'Sole technical owner',
    periodStart: '2026-08-03T00:00:00.000Z',
    featured: true,
    order: 2,
    tech,
    // The repository is private today. The CMS requires a link, and this is
    // the only one that exists until the app reaches a store.
    links: { repoUrl: 'https://github.com/Edufalcao14/buvio-mobile' },
    thumbnail: id('11-verdict.png'),
    metrics: METRICS,
    projectSection: SECTIONS.map((s) => ({
      title: s.title,
      description: s.description,
      image: s.files.map(id),
    })),
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: 'buvio' } },
    limit: 1,
    overrideAccess: true,
    draft: true,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'projects', id: existing.docs[0].id, data, overrideAccess: true })
    log('case updated')
    return
  }
  await payload.create({ collection: 'projects', data, overrideAccess: true })
  log('case created')
}

console.log('\nSeeding Buvio\n')
await seedCase()
console.log('\nDone.\n')
process.exit(0)
