/**
 * Seeds the Deentz case study, with its media.
 *
 * Runs through the Payload local API rather than raw SQL so that uploads get
 * their `thumb`/`card`/`full` derivatives, land in Supabase Storage through the
 * S3 plugin, and the case is written with the same validators the admin panel
 * applies. Nothing here turns the copy rules off.
 *
 * The case carries no narrative body: it is the summary in the hero plus the
 * screenshot sections. Prose, if it is ever wanted, belongs in the panel rather
 * than in a Lexical tree hand-built by a script.
 *
 * Idempotent. Media is matched by `alt`, the case by slug, so a second run
 * updates instead of duplicating.
 *
 * Run: npm run seed:deentz
 */
import { readdir } from 'node:fs/promises'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

const MEDIA_DIR = path.resolve(process.cwd(), 'media-temp')

/**
 * Says out loud which database is about to be written to.
 *
 * The `.env` keeps the production URI commented out on purpose, so this script
 * is normally pointed at production by overriding `DATABASE_URI` on the command
 * line. That is easy to get wrong in the invisible direction, hence the print.
 * `NODE_ENV` is checked too: the postgres adapter turns schema push on in
 * development, and pushing a laptop's schema onto production is the accident the
 * comment in `.env` warns about.
 */
const announceTarget = () => {
  const uri = process.env.DATABASE_URI ?? ''
  const target = uri.replace(/:\/\/[^@]*@/, '://***@')
  console.log(`  database: ${target}`)
  console.log(`  NODE_ENV: ${process.env.NODE_ENV} (schema push is off unless "development")`)
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Refusing to run with NODE_ENV=development: that turns schema push on.')
  }
}

announceTarget()

const payload = await getPayload({ config })
const log = (message: string) => console.log(`  ${message}`)

// ─────────────────────────────────────────────────────────────────────────────
// Technologies. Existing rows are reused by slug; the ones this case needs and
// the database does not have yet get created without an icon, so they carry the
// stack on the case page without appearing in the skills grid.
// ─────────────────────────────────────────────────────────────────────────────

type Layer = 'frontend' | 'backend' | 'tooling'

/**
 * The stack of this case, split the way a case page reads it.
 *
 * `layer` is written onto the technology even when the row already exists,
 * because it is the field the badges group by and an unset one renders
 * ungrouped. Mobile entries are deliberately absent: this case is the web app
 * and the API behind it, and listing React Native under a case that does not
 * discuss it is a claim the page never supports.
 */
const EXISTING_TECH: { slug: string; layer: Layer }[] = [
  { slug: 'next-js', layer: 'frontend' },
  { slug: 'react', layer: 'frontend' },
  { slug: 'tanstack-query', layer: 'frontend' },
  { slug: 'node-js', layer: 'backend' },
  { slug: 'express', layer: 'backend' },
  { slug: 'graphql', layer: 'backend' },
  { slug: 'postgresql', layer: 'backend' },
  { slug: 'onion-architecture', layer: 'backend' },
  { slug: 'typescript', layer: 'tooling' },
  { slug: 'docker', layer: 'tooling' },
  { slug: 'git', layer: 'tooling' },
]

/** Specific to this project. Created if missing. */
const NEW_TECH: { name: string; category: 'mobile' | 'web' | 'tooling'; layer: Layer }[] = [
  { name: 'Apollo Client', category: 'web', layer: 'frontend' },
  { name: 'Tailwind CSS', category: 'web', layer: 'frontend' },
  { name: 'Astro', category: 'web', layer: 'frontend' },
  { name: 'Prisma', category: 'web', layer: 'backend' },
  { name: 'Row-Level Security', category: 'web', layer: 'backend' },
  { name: 'Vitest', category: 'tooling', layer: 'tooling' },
  { name: 'Playwright', category: 'tooling', layer: 'tooling' },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const resolveTech = async (): Promise<number[]> => {
  const ids: number[] = []

  for (const { slug, layer } of EXISTING_TECH) {
    const found = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const existing = found.docs[0]
    if (!existing) {
      throw new Error(
        `Technology "${slug}" is missing. Run \`npm run seed\` first: this script does not invent stack entries.`,
      )
    }

    if (existing.layer !== layer) {
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

  for (const { name, category, layer } of NEW_TECH) {
    const slug = slugify(name)
    const found = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    const existing = found.docs[0]
    if (existing) {
      if (existing.layer !== layer) {
        await payload.update({
          collection: 'technologies',
          id: existing.id,
          data: { layer },
          overrideAccess: true,
        })
        log(`tech ${name} set to ${layer}`)
      }
      ids.push(existing.id as number)
      continue
    }

    const created = await payload.create({
      collection: 'technologies',
      data: { name, slug, category, layer, highlight: false },
      overrideAccess: true,
    })
    ids.push(created.id as number)
    log(`tech ${name} created as ${layer}`)
  }

  return ids
}

// ─────────────────────────────────────────────────────────────────────────────
// Media. One entry per file in media-temp, with alt text written by hand: the
// collection requires it and a filename is not a description.
// ─────────────────────────────────────────────────────────────────────────────

type MediaSpec = { file: string; alt: string; caption?: string }

const MEDIA: MediaSpec[] = [
  {
    file: '01-overview.png',
    alt: 'Deentz dashboard showing the day: revenue, appointments booked, patients seen and a revenue chart',
    caption: 'The day in one screen, so closing it does not need a spreadsheet.',
  },
  {
    file: '02-agenda.png',
    alt: 'Deentz schedule view with appointments laid out by hour and dentist',
    caption: 'Two overlapping appointments for the same dentist are rejected by a database constraint.',
  },
  {
    file: '03-pacientes.png',
    alt: 'Deentz patient list with search, status and last visit per row',
  },
  {
    file: '04-paciente-novo.png',
    alt: 'Deentz new patient form with personal data, contact and address fields',
    caption: 'Filled once, at the point of care, instead of on paper and then again in a spreadsheet.',
  },
  {
    file: '05-paciente-detalhe.png',
    alt: 'Deentz patient record with the dental chart, treatments, appointments and payments',
  },
  {
    file: '06-paciente-anamnese.png',
    alt: 'Deentz medical history form for a patient, with health questions and allergies',
    caption: 'Health data under art. 11 of the LGPD, which is why it never reaches the copilot unaliased.',
  },
  {
    file: '08-tratamento-detalhe.png',
    alt: 'Deentz treatment detail showing the teeth in the plan, the estimate and how much is already paid',
    caption: '"Budgeted" and "paid" are separate numbers: a treatment plan is not revenue.',
  },
  {
    file: '09-consultorio.png',
    alt: 'Deentz appointment room view with the appointment in progress and its procedures',
  },
  {
    file: '10-financeiro.png',
    alt: 'Deentz financial overview with revenue, expenses and result for the period',
  },
  {
    file: '11-financeiro-transacoes.png',
    alt: 'Deentz transaction list with payments received, method and status',
  },
  {
    file: '12-financeiro-despesas.png',
    alt: 'Deentz expense screen with recurring and one-off costs of the clinic',
  },
  {
    file: '13-financeiro-categorias.png',
    alt: 'Deentz expense category management screen',
  },
  {
    file: '14-financeiro-servicos.png',
    alt: 'Deentz service catalogue with the price of each procedure',
    caption: 'The catalogue price is copied onto the billing line and frozen there, so a repricing does not rewrite history.',
  },
  {
    file: '15-estoque.png',
    alt: 'Deentz stock screen with materials, quantity on hand and low-stock warnings',
  },
  {
    file: '16-equipe.png',
    alt: 'Deentz team screen listing staff with their role in the clinic',
  },
  {
    file: '17-visao-funcionario.png',
    alt: 'Deentz employee view, showing what a receptionist or assistant sees instead of the owner view',
    caption: 'Four roles, and the role decides the screen: Owner, Dentist, Receptionist, Assistant.',
  },
  {
    file: '18-juridico.png',
    alt: 'Deentz legal screen with LGPD consent records and documents per patient',
  },
  {
    file: '19-notificacoes.png',
    alt: 'Deentz notification centre listing alerts for the clinic',
  },
  {
    file: '20-config.png',
    alt: 'Deentz settings screen with the clinic configuration sections',
  },
  {
    file: '21-config-planos.png',
    alt: 'Deentz subscription plan screen showing the current plan and its limits',
  },
  {
    file: '22-config-perfil.png',
    alt: 'Deentz profile settings with the user name, photo and contact details',
  },
  {
    file: '23-config-seguranca.png',
    alt: 'Deentz security settings with password change and session controls',
  },
  {
    file: '24-config-privacidade.png',
    alt: 'Deentz privacy settings with data handling and LGPD options',
  },
  {
    file: '25-entrar.png',
    alt: 'Deentz sign-in screen',
  },
  {
    file: '26-criar-conta.png',
    alt: 'Deentz account creation screen for a new clinic',
  },
  {
    file: '27-copiloto-conversa.png',
    alt: 'Deentz copilot answering a question about the clinic in a chat panel',
    caption: 'The question goes out pseudonymised: real people are PATIENT_n by the time the prompt leaves the server.',
  },
  {
    file: 'app-copiloto-conversa.webm',
    alt: 'Screen recording of the Deentz mobile copilot answering a question about the clinic',
    caption: 'The mobile copilot, so the numbers are reachable away from the clinic.',
  },
]

const uploadMedia = async (): Promise<Map<string, number>> => {
  const present = new Set(await readdir(MEDIA_DIR))
  const missing = MEDIA.filter((entry) => !present.has(entry.file)).map((entry) => entry.file)
  if (missing.length > 0) {
    throw new Error(`Missing in media-temp: ${missing.join(', ')}`)
  }

  const unlisted = [...present].filter(
    (file) => !file.startsWith('.') && !MEDIA.some((entry) => entry.file === file),
  )
  if (unlisted.length > 0) {
    log(`not uploaded, no alt text written for them: ${unlisted.join(', ')}`)
  }

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

// ─────────────────────────────────────────────────────────────────────────────
// The case.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The walkthrough, in reading order.
 *
 * The copilot leads, and its recording is the first file in it, so the video is
 * the first thing that moves on the page. That is data, not code: the walkthrough
 * renders sections in the order the CMS holds them, so reordering is an edit in
 * the panel for any project.
 *
 * `description` is the sentence that makes a screenshot worth looking at. It is
 * optional in the CMS, and a section without one renders as a titled grid.
 */
const SECTIONS: { title: string; description: string; files: string[] }[] = [
  {
    title: 'The copilot, on the web and on the phone',
    description:
      'A tool-calling agent on the backend, answering in plain Portuguese. The figures in its cards come from the query result rather than from the model, so a number on screen cannot be rewritten by a language model.',
    files: ['app-copiloto-conversa.webm', '27-copiloto-conversa.png'],
  },
  {
    title: 'The day, closed without a spreadsheet',
    description:
      'Revenue, appointments and no-shows on one screen. Closing the day stops being a nightly retyping job, which is the four hours this was built to remove.',
    files: ['01-overview.png', '02-agenda.png', '09-consultorio.png'],
  },
  {
    title: 'The patient record',
    description:
      "Paper forms became one screen, filled once at the point of care. Health data sits under art. 11 of the LGPD, so a patient's name never reaches an external model unaliased.",
    files: [
      '03-pacientes.png',
      '04-paciente-novo.png',
      '05-paciente-detalhe.png',
      '06-paciente-anamnese.png',
      '08-tratamento-detalhe.png',
    ],
  },
  {
    title: 'Money, and where it comes from',
    description:
      "Catalogue prices are copied onto the billing line and frozen, so repricing a service does not rewrite last year's invoices. Partial refunds are atomic: two concurrent refunds against one payment resolve to exactly one winner.",
    files: [
      '10-financeiro.png',
      '11-financeiro-transacoes.png',
      '12-financeiro-despesas.png',
      '13-financeiro-categorias.png',
      '14-financeiro-servicos.png',
    ],
  },
  {
    title: 'Stock, team and what each role sees',
    description:
      'Four roles, and the role decides the screen. A receptionist sees what a receptionist needs, and the agent is handed only the tools that role is allowed to call.',
    files: ['15-estoque.png', '16-equipe.png', '17-visao-funcionario.png'],
  },
  {
    title: 'Consent, privacy and the account',
    description:
      'Consent records, retention and the account settings. Every mutation that touches a patient is written to an audit log.',
    files: [
      '18-juridico.png',
      '19-notificacoes.png',
      '20-config.png',
      '21-config-planos.png',
      '22-config-perfil.png',
      '23-config-seguranca.png',
      '24-config-privacidade.png',
      '25-entrar.png',
      '26-criar-conta.png',
    ],
  },
]

/**
 * The measured numbers. Every one carries how it was measured, which the CMS
 * enforces per row: a figure that cannot say where it came from is not
 * publishable.
 */
const METRICS: { value: string; label: string; method: string }[] = [
  {
    value: '4 h/day',
    label: 'Admin time removed',
    method:
      'Self-reported by the clinic owner, measured against the manual routine it replaced.',
  },
  {
    value: '809',
    label: 'API tests',
    method: 'Across 114 files, counted by npm run verify with tsc and lint clean.',
  },
  {
    value: '2 into 1',
    label: 'Money streams in a purpose-built ledger',
    method:
      'The finance module is its own ledger rather than an accounting integration: appointment billing lines and the expense book merge in get-finance-ledger.ts, and the filter plus both totals run before the page slice, so the sums cover every row the filters keep and not just the page on screen.',
  },
  {
    value: '97%',
    label: 'Copilot task accuracy on open-weight models',
    method:
      'The agent runs on open-weight models only: Qwen3-235B through OpenRouter, with DeepSeek and Llama 3.3 70B as fallbacks. The accuracy is scored by the author across the copilot task set, not yet by an automated suite.',
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
    title: 'Deentz',
    slug: 'deentz',
    summary:
      "An ERP/CRM for a solo dental clinic, replacing paper forms and a nightly spreadsheet close. A GraphQL API on Node and Postgres, where tenant isolation is enforced by the database instead of by remembering to check it. A Next.js app over it, and a copilot that answers questions about the clinic without the model ever seeing a patient's name, or a number it could alter. In beta at two clinics.",
    // No narrative. The case is carried by the summary in the hero and the
    // screenshot sections. This is null rather than an empty document: the
    // renderer bails on a falsy body, while a blank one would draw an empty box.
    body: null,
    kind: 'web' as const,
    proofTier: 'tier2' as const,
    company: 'Deentz',
    role: 'Sole technical owner',
    periodStart: '2026-03-28T00:00:00.000Z',
    featured: true,
    order: 1,
    tech,
    links: { liveUrl: 'https://www.deentz.com.br' },
    thumbnail: id('01-overview.png'),
    metrics: METRICS,
    projectSection: SECTIONS.map((section) => ({
      title: section.title,
      description: section.description,
      image: section.files.map(id),
    })),
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: 'deentz' } },
    limit: 1,
    overrideAccess: true,
    draft: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'projects',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    log('case updated')
    return
  }

  await payload.create({ collection: 'projects', data, overrideAccess: true })
  log('case created')
}

console.log('\nSeeding Deentz\n')
await seedCase()
console.log('\nDone.\n')
process.exit(0)
