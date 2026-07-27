/**
 * Seeds the canonical facts from PRODUCT.md so the site has real content to
 * render on a fresh database.
 *
 * Only facts that are already fixed go in here: identity, availability, roles,
 * dates, education, stack, and the measured numbers with their methods. No case
 * study copy is invented. Cases arrive through the Hygraph import or get written
 * by hand, because "measured or unsaid" applies to the seed too.
 *
 * Idempotent: run it as many times as you like.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SiDocker,
  SiExpo,
  SiExpress,
  SiFastlane,
  SiGit,
  SiGithubactions,
  SiJavascript,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTypescript,
} from 'react-icons/si'
import { TbBrandReactNative } from 'react-icons/tb'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'

/**
 * Icons are stored as SVG markup because the frontend injects them inline
 * (sanitised) rather than loading an image. Rendering react-icons to static
 * markup here gives correct brand paths instead of hand-drawn approximations.
 */
const svg = (Icon: IconType): string => renderToStaticMarkup(Icon({ size: 28 }) as never)

const payload = await getPayload({ config })

const log = (message: string) => console.log(`  ${message}`)

/** Upsert by a unique-ish field so re-running does not duplicate rows. */
const upsert = async <T extends 'technologies' | 'experiences' | 'education'>(
  collection: T,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) => {
  const existing = await payload.find({
    collection,
    where: where as never,
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data: data as never,
      overrideAccess: true,
    })
  }

  return payload.create({ collection, data: data as never, overrideAccess: true })
}

const seedPortrait = async () => {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { like: 'Eduardo Sampaio Falcão' } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    log('portrait already uploaded')
    return existing.docs[0]
  }

  const filePath = path.resolve('public/images/professional_picture.png')
  const buffer = await readFile(filePath)

  const media = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt: 'Eduardo Sampaio Falcão, mobile engineer, head and shoulders' },
    file: {
      data: buffer,
      name: 'professional_picture.png',
      mimetype: 'image/png',
      size: buffer.byteLength,
    },
  })
  log('portrait uploaded')
  return media
}

/**
 * The skills grid, in the order Eduardo asked for.
 *
 * `order` drives the grid and `highlight` decides whether an entry appears in it
 * at all, so both are content rather than code: the sequence can be changed in
 * the panel without touching this file again.
 *
 * The entries below the grid exist so experiences and cases have technologies to
 * relate to. They are intentionally not shown in the grid, because listing
 * everything reads as generalist.
 */
const SKILLS: { name: string; category: 'mobile' | 'web' | 'tooling'; icon: IconType }[] = [
  { name: 'TypeScript', category: 'mobile', icon: SiTypescript },
  { name: 'React Native', category: 'mobile', icon: TbBrandReactNative },
  { name: 'Expo', category: 'mobile', icon: SiExpo },
  { name: 'Node.js', category: 'web', icon: SiNodedotjs },
  { name: 'PostgreSQL', category: 'web', icon: SiPostgresql },
  { name: 'Express', category: 'web', icon: SiExpress },
  { name: 'React', category: 'web', icon: SiReact },
  { name: 'JavaScript', category: 'web', icon: SiJavascript },
  { name: 'Git', category: 'tooling', icon: SiGit },
  { name: 'GitHub Actions CI/CD', category: 'tooling', icon: SiGithubactions },
  { name: 'Fastlane', category: 'tooling', icon: SiFastlane },
  { name: 'Docker', category: 'tooling', icon: SiDocker },
]

/**
 * Earlier runs created these under different names. Renaming in place keeps the
 * document id, so every experience and case that already points at them keeps
 * its relation; creating fresh rows would leave two entries for one tool and
 * silently drop the old links.
 */
const RENAMES: { from: string; to: string }[] = [
  { from: 'GitHub Actions', to: 'GitHub Actions CI/CD' },
  { from: 'Fastlane on a self-hosted runner', to: 'Fastlane' },
]

/** Relation-only: available to tag experiences and cases, absent from the grid. */
const SUPPORTING_TECHNOLOGIES: {
  name: string
  category: 'mobile' | 'web' | 'tooling'
}[] = [
  { name: 'New Architecture (Fabric, TurboModules)', category: 'mobile' },
  { name: 'Reanimated', category: 'mobile' },
  { name: 'Swift', category: 'mobile' },
  { name: 'Kotlin', category: 'mobile' },
  { name: 'Offline-first sync', category: 'mobile' },
  { name: 'Next.js', category: 'web' },
  { name: 'GraphQL', category: 'web' },
  { name: 'Kysely Query Builder', category: 'web' },
  { name: 'Onion Architecture', category: 'web' },
  { name: 'TanStack Query', category: 'mobile' },
  { name: 'Firebase Cloud Messaging', category: 'mobile' },
  { name: 'Firebase Auth', category: 'web' },
  { name: 'Firebase Crashlytics', category: 'tooling' },
  { name: 'Expo Native Modules', category: 'mobile' },
  { name: 'SwiftUI', category: 'mobile' },
  { name: 'Maestro', category: 'tooling' },
  { name: 'Sentry', category: 'tooling' },
  { name: 'Yarn monorepo', category: 'tooling' },
]

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      },
    ],
  },
})

/** A bullet list in Lexical, with an optional bold lead-in per item. */
const bullets = (items: { lead?: string; rest: string }[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: items.map((item, index) => ({
          type: 'listitem',
          value: index + 1,
          checked: undefined,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            ...(item.lead
              ? [
                  {
                    type: 'text',
                    detail: 0,
                    // format 1 is bold in Lexical's bitmask.
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: item.lead,
                    version: 1,
                  },
                ]
              : []),
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: item.rest,
              version: 1,
            },
          ],
        })),
      },
    ],
  },
})

const main = async () => {
  console.log('\nSeeding canonical facts\n')

  const portrait = await seedPortrait()

  // ---- Technologies ----
  const techIds = new Map<string, number | string>()

  for (const rename of RENAMES) {
    const existing = await payload.find({
      collection: 'technologies',
      where: { name: { equals: rename.from } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'technologies',
        id: existing.docs[0].id,
        data: { name: rename.to },
        overrideAccess: true,
      })
      log(`renamed "${rename.from}" to "${rename.to}"`)
    }
  }

  for (const [index, skill] of SKILLS.entries()) {
    const doc = await upsert(
      'technologies',
      { name: { equals: skill.name } },
      {
        name: skill.name,
        category: skill.category,
        highlight: true,
        order: index + 1,
        iconSvg: svg(skill.icon),
      },
    )
    techIds.set(skill.name, doc.id)
  }
  log(`${SKILLS.length} skills in the grid`)

  for (const tech of SUPPORTING_TECHNOLOGIES) {
    const doc = await upsert(
      'technologies',
      { name: { equals: tech.name } },
      { ...tech, highlight: false, order: null, iconSvg: null },
    )
    techIds.set(tech.name, doc.id)
  }
  log(`${SUPPORTING_TECHNOLOGIES.length} supporting technologies`)

  const ids = (names: string[]) => names.map((name) => techIds.get(name)).filter(Boolean)

  // ---- Experience ----
  await upsert(
    'experiences',
    { company: { equals: 'Nightborn' } },
    {
      order: 1,
      role: 'Full Stack Software Engineer',
      company: 'Nightborn',
      location: 'Brussels, Belgium',
      startDate: '2025-02-01',
      employmentType: 'fullTime',
      tech: ids([
        'React Native',
        'Expo',
        'Expo Native Modules',
        'TypeScript',
        'SwiftUI',
        'Kotlin',
        'TanStack Query',
        'Firebase Cloud Messaging',
        'Firebase Auth',
        'Firebase Crashlytics',
        'GraphQL',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Kysely Query Builder',
        'Onion Architecture',
        'Maestro',
        'Sentry',
        'Fastlane',
        'GitHub Actions CI/CD',
      ]),
      body: paragraph(
        'Build React Native and React/TypeScript features for 6+ clients, from architecture to production, and support junior developers through code review and pair programming.',
      ),
      projects: [
        {
          name: 'Golden Palace Casino',
          descriptor: 'React Native app (iOS & Android, fintech)',
          bullets: bullets([
            {
              lead: 'Shipped 30+ production features ',
              rest: 'in a React Native fintech app (~30k active users): multiple payment providers and identity/bank-compliance checks with camera document and card scanning, geolocation, and biometric login.',
            },
            {
              lead: 'Resolved complex interaction conflicts between React Native Gesture Handler and a WebView with an interactive canvas, ',
              rest: 'implementing a native module wrapper around the WebView to intercept and control touch events between the native and web contexts.',
            },
            {
              lead: 'Doubled UI rendering performance ',
              rest: 'on low-end devices, from under 30 to a stable 60 FPS, through render-tree profiling, list virtualization and memoization.',
            },
            {
              lead: 'Reduced app startup time by 78%, from 4.1s to 0.9s, ',
              rest: 'by enabling Hermes and restructuring the lazy-loading strategy for non-essential screens.',
            },
            {
              lead: 'Eliminated post-launch regressions ',
              rest: 'on critical onboarding and transaction flows with a Maestro E2E suite (15+ bugs caught before release) and real-time crash telemetry.',
            },
            {
              lead: 'Reduced mobile build time by ~85%, from 35 to under 5 minutes, ',
              rest: 'by building a build-caching system.',
            },
          ]),
          // Empty on purpose: the stack is shown once per role, not repeated
          // under every product. Omitting the key entirely leaves stale
          // relations behind, so it has to be an explicit empty array.
          stack: [],
        },
        {
          name: 'Press Shop & More',
          descriptor: 'React Native loyalty app and the backend behind it',
          bullets: bullets([
            {
              lead: 'Cut delivery time by at least 50% ',
              rest: 'by defining the API contracts together with the tech lead before implementation started, which let backend and frontend be built in parallel instead of one waiting on the other.',
            },
            {
              lead: 'Shipped 20+ critical flows ',
              rest: 'across authentication, payments and loyalty, on an initial project structure I helped architect with Clean Architecture boundaries and a design system I contributed to.',
            },
            {
              lead: 'Reduced build time from 35 minutes to under 5 ',
              rest: 'by building a build-caching system, shortening the feedback loop for the whole team.',
            },
            {
              lead: 'Removed the manual release steps ',
              rest: 'by building pipelines that upload test builds automatically to TestFlight and Firebase App Distribution.',
            },
            {
              lead: 'Made the physical loyalty card usable inside the app ',
              rest: "by implementing camera scanning of the card and wiring it to the client's loyalty API, with TanStack Query handling cache and sync.",
            },
            {
              lead: 'Enabled re-engagement messaging ',
              rest: 'by implementing push notifications through Firebase Cloud Messaging.',
            },
            {
              lead: 'Unblocked frontend work from day one ',
              rest: 'by building the first backend endpoints the app consumed, implemented from the technical specification written by the tech lead.',
            },
            {
              lead: "Reduced the app to a single contract instead of two systems ",
              rest: "by wrapping the client's loyalty-points API as a gateway inside our backend, so the app never talked to the external service directly.",
            },
            {
              lead: 'Enabled payments end to end ',
              rest: 'by integrating several payment gateways in the backend and covering the correctness and security of each transaction path.',
            },
            {
              lead: 'Owned authentication in the backend ',
              rest: 'by integrating Firebase Auth as the identity gateway, including token issuing and refresh, and email verification.',
            },
          ]),
          stack: [],
        },
      ],
    },
  )

  await upsert(
    'experiences',
    { company: { equals: 'C Design' } },
    {
      order: 2,
      role: 'Freelance Lead Software Engineer',
      company: 'C Design',
      startDate: '2026-02-01',
      endDate: '2026-03-01',
      employmentType: 'freelance',
      tech: ids(['Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'React']),
      body: bullets([
        {
          lead: 'Delivered the platform from concept to deployment in under two months ',
          rest: 'by leading the work end to end and coordinating a team of three, myself plus one developer and a designer, through to handover to the client.',
        },
        {
          lead: 'Increased qualified leads by 30% ',
          rest: 'by building the lead capture and management flow the sales side now works from, so every enquiry lands in one place instead of several.',
        },
        {
          lead: "Gave the client's team control of its own catalogue and site copy ",
          rest: 'by building an internal platform with ERP and basic CRM features: content management, product management, and customer estimate management.',
        },
        {
          lead: 'Turned school campaigns into something the client sells without manual invoicing ',
          rest: 'by building campaign creation and payment links that parents pay directly.',
        },
        {
          lead: 'Made the quoting step self-service ',
          rest: 'by building a multi-step quoting engine that produces the estimate the client used to write by hand for each enquiry.',
        },
      ]),
    },
  )

  await upsert(
    'experiences',
    { company: { equals: 'Vision Tech Group' } },
    {
      order: 3,
      role: 'Software Engineer (Part-time)',
      company: 'Vision Tech Group',
      location: 'Brussels, Belgium',
      startDate: '2023-03-01',
      endDate: '2024-11-01',
      employmentType: 'partTime',
      tech: ids(['React Native', 'React', 'TypeScript', 'Node.js', 'Express']),
      // No named product here, so the evidence lives on the role itself rather
      // than in a project block.
      body: bullets([
        {
          lead: 'Reduced reported technical debt ',
          rest: 'by fixing critical defects in authentication and transaction flows across React Native, React and Node.js/Express applications, triaging logic errors at their source.',
        },
        {
          lead: 'Refactored over 80% of the legacy codebase ',
          rest: 'to modern function hooks, consistent React Native patterns and strict TypeScript.',
        },
      ]),
    },
  )
  log('3 experience entries')

  // ---- Education ----
  await upsert(
    'education',
    { institution: { equals: 'Haute École Léonard de Vinci' } },
    {
      degree: 'BSc Computer Science',
      institution: 'Haute École Léonard de Vinci',
      startDate: '2022-09-01',
      endDate: '2025-06-01',
    },
  )
  log('1 education entry')

  // ---- Site settings ----
  await payload.updateGlobal({
    slug: 'siteSettings',
    overrideAccess: true,
    data: {
      name: 'Eduardo Sampaio Falcão',
      headline: 'Mobile Engineer · React Native & Expo',
      email: 'eduardosampaiofalcao@gmail.com',
      availability: {
        location: 'São Paulo',
        from: '2026-08-01',
        note: 'Authorised to work in Brazil',
      },
      socials: [
        { label: 'GitHub', url: 'https://github.com/Edufalcao14', iconSvg: svg(FaGithub) },
        {
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/edusampaiofalcao',
          iconSvg: svg(FaLinkedin),
        },
      ],
      defaultTitle: 'Eduardo Falcão, Mobile Engineer · React Native & Expo',
      defaultDescription:
        'Mobile engineer, React Native and Expo. 3 years of apps in production in fintech: payments, KYC, biometrics, 30k active users.',
      defaultOgImage: portrait.id,
    },
  })
  log('site settings')

  // ---- Home page ----
  await payload.updateGlobal({
    slug: 'homePage',
    overrideAccess: true,
    data: {
      _status: 'published',
      introduction: paragraph(
        'I make React Native apps fast on the phones your users actually have. Three years shipping iOS and Android in production inside regulated fintech: payments, KYC, biometrics, 30k active users. Available in São Paulo from August 2026.',
      ),
    },
  })
  log('home page')

  // ---- Projects page ----
  await payload.updateGlobal({
    slug: 'projectsPage',
    overrideAccess: true,
    data: {
      mainText:
        'Cases with the problem, the constraint, the decision I made, what it cost, and the number afterwards. Every project here has a link you can open.',
    },
  })
  log('projects page')

  // ---- Resume page ----
  await payload.updateGlobal({
    slug: 'resumePage',
    overrideAccess: true,
    data: {
      _status: 'published',
      aboutMeText: paragraph(
        'I fix what stalls React Native apps in production: performance on low-end devices, conflicts between the native and JS layers, the build pipeline, and release stability. I ship Next.js, Node and Postgres when a project needs it, and that makes me better at mobile because I understand the API on the other side.',
      ),
      educationText: 'Computer science degree, plus the certifications that were worth the hours.',
      skillText:
        'What I would be comfortable being interviewed on in depth, not everything I have ever touched.',
      experienceText:
        "I am always open to new challenges. Tell me what you are building and what is in the way.",
    },
  })
  log('resume page')

  console.log('\nDone.\n')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
