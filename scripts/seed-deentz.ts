/**
 * Seeds the Deentz case study, with its media.
 *
 * Runs through the Payload local API rather than raw SQL so that uploads get
 * their `thumb`/`card`/`full` derivatives, land in Supabase Storage through the
 * S3 plugin, and the case is written with the same validators the admin panel
 * applies. Nothing here turns the copy rules off: the body is written to pass
 * them.
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
// Lexical builders. The case editor allows h2/h3, bold, inline code, links,
// both list kinds and blockquote, so the body stays inside that set.
// ─────────────────────────────────────────────────────────────────────────────

/** Shape Payload requires of a Lexical node: a discriminator and a version. */
type Node = { type: string; version: number } & Record<string, unknown>

const FORMAT_BOLD = 1
const FORMAT_CODE = 16

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const bold = (value: string) => text(value, FORMAT_BOLD)
const code = (value: string) => text(value, FORMAT_CODE)

/**
 * Inline markup without hand-writing node arrays: `**bold**` and `` `code` ``
 * in a plain string become the corresponding text nodes.
 *
 * There is deliberately no `_italic_` rule. This case is full of identifiers
 * that carry underscores (`PATIENT_1`, `get_agenda`, `text_delta`), and an
 * italic rule turns the span between any two of them into emphasis. Bold covers
 * the emphasis this body actually needs.
 */
const inline = (value: string): Node[] =>
  value
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith('**')) return bold(part.slice(2, -2))
      if (part.startsWith('`')) return code(part.slice(1, -1))
      return text(part)
    })

const paragraph = (value: string): Node => ({
  type: 'paragraph',
  children: inline(value),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2'): Node => ({
  type: 'heading',
  tag,
  children: inline(value),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const bullets = (items: string[]): Node => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, index) => ({
    type: 'listitem',
    value: index + 1,
    checked: undefined,
    children: inline(item),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const doc = (children: Node[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// Technologies. Existing rows are reused by slug; the ones this case needs and
// the database does not have yet get created without an icon, so they carry the
// stack on the case page without appearing in the skills grid.
// ─────────────────────────────────────────────────────────────────────────────

/** Already seeded by `scripts/seed.ts`. Looked up, never created. */
const EXISTING_TECH = [
  'typescript',
  'node-js',
  'express',
  'graphql',
  'postgresql',
  'next-js',
  'react',
  'react-native',
  'expo',
  'reanimated',
  'tanstack-query',
  'onion-architecture',
  'docker',
  'git',
]

/** Specific to this project. Created if missing. */
const NEW_TECH: { name: string; category: 'mobile' | 'web' | 'tooling' }[] = [
  { name: 'Prisma', category: 'web' },
  { name: 'Apollo Client', category: 'web' },
  { name: 'Tailwind CSS', category: 'web' },
  { name: 'Row-Level Security', category: 'web' },
  { name: 'Astro', category: 'web' },
  { name: 'Vitest', category: 'tooling' },
  { name: 'Playwright', category: 'tooling' },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const resolveTech = async (): Promise<number[]> => {
  const ids: number[] = []

  for (const slug of EXISTING_TECH) {
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
    ids.push(existing.id as number)
  }

  for (const { name, category } of NEW_TECH) {
    const slug = slugify(name)
    const found = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (found.docs[0]) {
      ids.push(found.docs[0].id as number)
      log(`tech ${name} already there`)
      continue
    }

    const created = await payload.create({
      collection: 'technologies',
      data: { name, slug, category, highlight: false },
      overrideAccess: true,
    })
    ids.push(created.id as number)
    log(`tech ${name} created`)
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

const SECTIONS: { title: string; files: string[] }[] = [
  {
    title: 'The day, closed without a spreadsheet',
    files: ['01-overview.png', '02-agenda.png', '09-consultorio.png'],
  },
  {
    title: 'The patient record',
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
    files: [
      '10-financeiro.png',
      '11-financeiro-transacoes.png',
      '12-financeiro-despesas.png',
      '13-financeiro-categorias.png',
      '14-financeiro-servicos.png',
    ],
  },
  {
    title: 'The copilot, on the web and on the phone',
    files: ['27-copiloto-conversa.png', 'app-copiloto-conversa.webm'],
  },
  {
    title: 'Stock, team and what each role sees',
    files: ['15-estoque.png', '16-equipe.png', '17-visao-funcionario.png'],
  },
  {
    title: 'Consent, privacy and the account',
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

const BODY = doc([
  heading('Context'),
  paragraph(
    'Deentz is practice-management software for small dental clinics in Brazil. It is mine end to end: schema, GraphQL API, web app, mobile app, landing page. Four repositories, one person, since March 2026. Two clinics run on it in beta.',
  ),

  heading('Problem'),
  paragraph(
    'My fiancée is a dentist and runs her practice alone. Patients filled in forms on paper. Every evening she retyped them into spreadsheets, totalled the day\'s income and expenses by hand, and only then was the day closed. About **4 hours a day**, by her own count of a normal working day.',
  ),
  paragraph(
    'The hours were the visible cost. The worse one was that the data existed and could not be read: which procedures actually paid, what a treatment plan had returned so far, whether the month was ahead or behind. Every answer had to be rebuilt by hand, so in practice nobody asked.',
  ),

  heading('The backend'),
  paragraph(
    'Node and Express with a single GraphQL endpoint over Apollo, Postgres through Prisma, layered as entities, use cases, repositories and resolvers. The layering is not a convention in a document: `scripts/check-architecture.mjs` runs in the pre-commit hook and in CI, and fails the commit if `@prisma/client` is imported anywhere outside the data-access and bootstrap layers. Entities and use cases reach the database only through `context.repositories`, so the ORM cannot leak into domain code by accident.',
  ),
  paragraph(
    'Three decisions carry most of the weight.',
  ),
  heading('Tenant isolation belongs to the database', 'h3'),
  paragraph(
    'Every child table carries a composite foreign key `(id, tenantId)`, so Postgres physically refuses to link one clinic\'s row to another\'s. On top of that, Row-Level Security policies cover **23 tables** and the app connects as a `dentis_app` role without `BYPASSRLS`. The first version was an `assertTenantMembership` call in about 90 use cases. That holds until one call is forgotten, and the failure mode of a forgotten call is one clinic reading another clinic\'s medical records. The assertions stayed; the database went underneath them.',
  ),
  heading('One table where three described the same event', 'h3'),
  paragraph(
    'The treatment-plan item, the clinical procedure and the billing line were the same fact written in three places, with no key tying them together: a restoration on tooth 36 was recorded twice and nothing made the two records agree. They converged into a single `procedures` row with a status of `PLANNED`, `COMPLETED`, `CONDITION`, `EXISTING` or `REFERRED`, which is the shape Open Dental settled on. The rejected alternative was a foreign key between the two tables, which keeps both writes and only makes the disagreement traceable.',
  ),
  heading('Correctness the code cannot forget', 'h3'),
  paragraph(
    'Money is `Prisma.Decimal` and every total is summed in Postgres, which retired the `Math.round(x * 100) / 100` that had been standing in for arithmetic. Catalogue prices are copied onto the billing line and frozen, so repricing a service does not rewrite last year\'s invoices. Double-booking is rejected by an `EXCLUDE USING gist` constraint with half-open windows, so 10:00 to 10:30 and 10:30 to 11:00 do not collide. Partial refunds are atomic: `UPDATE ... WHERE refundedAmount + $x <= amount` means two concurrent refunds of 60 against a payment of 100 resolve to exactly one winner.',
  ),

  heading('The web app'),
  paragraph(
    'Next.js on the App Router, server-first. Apollo Client is the primary data source, TanStack Query covers the REST endpoints and the prefetch-and-hydrate pattern, Tailwind and Radix carry the design system. Session tokens are httpOnly and never reach the browser, so anything the client needs goes through a route handler acting as a BFF.',
  ),
  paragraph(
    'The frontend has its own architecture guard, and it blocks commits rather than warning. No `use client` at a view root or on a page or layout, so interactivity has to be pushed down into leaf islands instead of climbing to the top of the tree. One component per folder. No barrel files, so imports name the real file. Types live in a sibling `.types.ts` and module-level data in a `.constants.ts`, never inside a `.tsx`. A leaf that accumulates three or more state hooks without a sibling `.logic.ts` gets flagged. These are the rules that decay first when a codebase is maintained by one person under time pressure, which is exactly why they are executable.',
  ),

  heading('The agentic system'),
  paragraph(
    'The copilot answers questions about the clinic in plain Portuguese: what the month looks like, who owes what, whether there is room on Thursday. It is the part of the product with the most design in it, because an ERP is the wrong place for a system that can be confidently wrong.',
  ),

  heading('The shape of a turn', 'h3'),
  paragraph(
    'A turn is a bounded tool-calling loop. The provider is reached through OpenRouter, default model `qwen/qwen3-235b-a22b`. Each iteration lets the model call tools, pushes the results back, and runs again until it produces prose or hits the iteration cap, at which point the user gets an honest refusal instead of a guess. The loop has three separate ceilings: iterations, a per-request timeout in the adapter, and a wall-clock timeout for the whole turn, because a loop of N steps multiplies the per-request worst case.',
  ),
  paragraph(
    'Quota is checked **before** the first provider call, never after spending. The limit comes from `Plan.features.agentTurnsPerMonth`, counted per tenant per calendar month, and a missing or non-numeric key means unlimited: absent data must not become a block.',
  ),

  heading('Thirteen tools, and the model is not told about the ones it may not use', 'h3'),
  paragraph(
    'The roster is read-only and domain-shaped: `get_agenda`, `check_availability`, `search_patients`, `get_patient_overview`, `get_clinic_overview`, `get_finance_summary`, `get_profit_and_loss`, `get_payments`, `get_overdue_payments`, `get_expenses`, `get_services_catalog`, `get_stock_status`, `get_team_info`. Each one wraps an existing use case, so the agent inherits tenant scoping and RLS rather than getting a private path to the data.',
  ),
  paragraph(
    'Tool definitions are filtered by the caller\'s role before the request is built. A tool the current user may not call is not refused at execution time, it is **absent from the definitions**, so the model cannot know it exists and cannot be talked into asking for it. A receptionist\'s copilot has no payroll tool to leak.',
  ),

  heading('Numbers never pass through the model', 'h3'),
  paragraph(
    'This is the decision I would defend hardest. Every tool returns two artefacts: `modelResult`, the pseudonymised string that goes into the prompt, and `blocks`, typed UI built from the real use-case result before pseudonymisation, with every value already formatted in Brazilian Portuguese on the server. Blocks travel outside the prompt, as their own SSE event and their own column on the stored message. The model never sees them, so it cannot round, reformat, convert a currency or move a digit.',
  ),
  paragraph(
    'The reason is that a card reading `R$ 48.320,00` looks authoritative by design, and a decision gets made on top of it. A model that changes one digit produces an error indistinguishable from a correct answer for the person reading it. Letting the model emit structured output would have been less code and is the common pattern; here it puts the wrong component in charge of the number. There are four block kinds, `kpi`, `list`, `table` and `empty`, and the tool chooses. Formatting living only on the server also means the two ends cannot drift apart, and the system prompt tells the model to summarise in one sentence when a card is present rather than reciting every figure.',
  ),

  heading('The model never learns who the patient is', 'h3'),
  paragraph(
    'Health data sits under art. 11 of the LGPD, and art. 11 §4 forbids using it for the vendor\'s own gain, so no patient identity may reach a third-party provider. Pseudonymisation runs in both directions around every call.',
  ),
  paragraph(
    'Outbound, an alias vault encrypted with AES-256-GCM maps each person to a stable `PATIENT_n` or staff alias, per conversation, so the same patient keeps the same alias across turns and the model can still reason about continuity. The user\'s own message is redacted too, since a dentist types real names: CPF, email and phone are pattern-stripped, and known real names are swapped for their aliases using Unicode word boundaries, because the ASCII `\\b` fails on a name like "José".',
  ),
  paragraph(
    'Inbound is the subtler half. Rehydrating a completed answer is easy; rehydrating a **stream** is not, because an alias arrives split across deltas. `PATIENT_3` can reach the server as `PATI` then `ENT_3`, and rehydrating each fragment on its own finds nothing, so the raw alias leaks to the screen. The rehydrator holds back any trailing substring of the buffer that could still grow into a known alias, releases everything before it, and flushes the remainder when the provider is done. That is a small function with a real test suite, and it is the difference between the privacy design working and merely being described.',
  ),

  heading('Context compaction: three free layers before the paid one', 'h3'),
  paragraph(
    'The provider API is stateless, so every call resends the whole conversation and the cost per conversation grows quadratically in the number of turns. Turn 10 pays for turns 1 through 9. What fattens the prompt is not the chat, it is tool output: a `get_agenda` returning 20 appointments stays in the history and is resent forever, long after the assistant summarised it in one sentence. There are also two ceilings, not one. The model\'s context window is the hard one; quality degrades from roughly 30k tokens, and that one arrives silently.',
  ),
  paragraph(
    'So the rule is to separate what is stored from what is sent. The database keeps the full history, because the user reads it. The prompt gets a compacted view, built by pure functions.',
  ),
  bullets([
    '**Layer 0, cut at the source.** A tool caps its own output. `get_agenda` returns at most 15 appointments and says "there are 34 in the period", so the data never enters the history large.',
    '**Layer 1, clear old tool results.** Outside a recency window of two turns, a tool result\'s content is **replaced**, not deleted, by a marker telling the model to call the tool again if it needs the data. Replaced rather than deleted because the wire format requires a `tool` message for every `tool_call`; dropping the answer while keeping the call makes the request invalid. The marker is instructive on purpose: without it the model hallucinates what used to be there. The in-flight turn is never touched.',
    '**Layer 2, a token budget.** If it is still too large, the budget is `min(0.7 × model window, 30k)` minus the system prompt, the tool definitions and an output reserve. Whole turns are dropped from the tail, never half an exchange, since an answer without its question confuses the model and an orphaned `tool_call` is a malformed request. Measurement estimates at `chars / 3`, conservative for Portuguese, calibrated against the real `usage.inputTokens` the provider already returns.',
    '**Layer 3, a rolling summary, behind a flag and switched off.** It runs over the already-pseudonymised text, so the summary is born holding only aliases. It stays off because it is the only layer that costs an inference call, and the first three have not needed help yet.',
  ]),
  paragraph(
    'The alternative was to do nothing and rely on provider prompt caching. Caching addresses price. The context window is a hard ceiling and the 30k figure is a quality one, so neither is a billing problem. Instrumentation came first: one log line per turn with real tokens and per-slice estimates, and the true cost of the tool definitions measured by sending the same message twice, once with an empty roster.',
  ),

  heading('Streaming, and why it leaves GraphQL', 'h3'),
  paragraph(
    'Everything else in the API enters through `/graphql`, where auth, rate limiting, depth limiting, error shaping and per-request context are already solved. Streaming breaks that rule because a GraphQL mutation cannot stream: it can only return the finished turn. Incremental delivery is built for parts of a document rather than N sequential tokens, and client support is uneven. The flow is also strictly one-directional and short-lived.',
  ),
  paragraph(
    'So the agent gets one dedicated Express endpoint, `POST /agent/stream`, mounted beside Apollo and serving `text/event-stream`, with the cost of stepping outside the shared middleware written down as an accepted consequence rather than discovered later. It emits typed events: the turn opening, a step per tool call so the UI can say "consulting the schedule" instead of "thinking", text deltas, the blocks, and a done event carrying real token usage.',
  ),

  heading('Tool output is data, not instruction', 'h3'),
  paragraph(
    'The system prompt states it explicitly, because tool results contain free text a patient typed into a form, and that is an injection surface. It also forbids inventing data when a tool returns nothing, forbids exposing internal field names such as `totalAmount` or `COMPLETED` to a clinic owner, and resolves relative dates like "tomorrow" in the clinic\'s timezone. Every timestamp in the system is Brasília time by decision, not by accident.',
  ),

  heading('Where it is now'),
  bullets([
    'The 4 hours a day of retyping and hand-totalling are gone. Data is entered once, at the point of care, and the day closes itself. Measured against the manual routine it replaced, self-reported by the clinic owner.',
    '**809 tests across 114 files** on the API, including its first integration tests against a real Postgres rather than mocks, with `tsc` and lint clean and a from-scratch rebuild verified. Measured by `npm run verify`.',
    'A 28-tooth treatment went from **28 queries to 2** through batch creation, and the per-patient teeth query from 2N+1 back to 1+N. Measured by query counts in the integration tests.',
    'Every compaction and pseudonymisation step is a pure function with its own test file, so the agent\'s privacy and cost behaviour is verifiable without mocking a provider.',
    '**Two clinics in beta.** A compact mobile version, Expo and React Native, carries the copilot so the numbers are reachable away from the clinic.',
  ]),
  paragraph(
    'An LGPD audit of the two main repositories produced a written list of **14 gaps** in priority order. CPF and medical history are still plaintext at rest. Subject-rights tooling, meaning export, correction and deletion on request, is specified and not built. There is no retention job yet, so agent chat messages have no expiry. Deletion can never be the way a mistake is undone either, since dental records carry a 20-year retention duty under Lei 13.787/2018. Writing the list down is the part I would defend. None of it gets fixed by claiming otherwise.',
  ),
])

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
      'An ERP/CRM I built for a solo dental clinic: paper forms and a nightly spreadsheet close replaced by one system, with an AI copilot over the data. In beta at two clinics.',
    body: BODY,
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
    projectSection: SECTIONS.map((section) => ({
      title: section.title,
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
