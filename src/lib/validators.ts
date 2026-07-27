import type { TextareaFieldValidation, TextFieldValidation, Validate } from 'payload'

/**
 * Copy rules from the positioning doc, enforced by the CMS instead of by memory.
 *
 * The doc lists these as words that read as generated text and are banned from
 * the site. Every one of them was present on the old site, which is why this is
 * a validator and not a note in a checklist.
 */
export const BANNED_WORDS = [
  'comprehensive',
  'digital ecosystem',
  'immersive',
  'seamless',
  'robust',
  'cutting-edge',
  'leverage',
  'empower',
  'streamline',
  'holistic',
  'future-proof',
  'operational excellence',
  'high-value user experiences',
  'diverse technical landscapes',
  'bridging the gap',
  'passionate about',
  'dedicated to delivering',
  'best-in-class',
  'state-of-the-art',
] as const

/** Openings and constructions the doc rules out alongside the word list. */
const BANNED_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'the em dash as a stylistic device', pattern: /—/ },
  { label: '"In today\'s ... world" opening', pattern: /in today'?s\s+[\w-]+\s+world/i },
  { label: 'the "not just X, it\'s Y" construction', pattern: /not just .{1,40}?,?\s*it'?s\s/i },
]

/**
 * The migration imports content written before these rules existed. Nothing
 * imported is ever published, so the import turns the rules off and reports
 * what it found instead of refusing to run.
 */
const rulesDisabled = () => process.env.PAYLOAD_DISABLE_COPY_RULES === 'true'

export type CopyOffence = { term: string; kind: 'word' | 'pattern' }

export const findCopyOffences = (text: string): CopyOffence[] => {
  const offences: CopyOffence[] = []

  for (const word of BANNED_WORDS) {
    // Word boundaries so "leverage" fires but "leveraged" inside a quoted
    // client name does not slip through on a partial match either way.
    const pattern = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i')
    if (pattern.test(text)) offences.push({ term: word, kind: 'word' })
  }

  for (const { label, pattern } of BANNED_PATTERNS) {
    if (pattern.test(text)) offences.push({ term: label, kind: 'pattern' })
  }

  return offences
}

/** Pulls every text node out of a Lexical editor state. */
export const extractLexicalText = (value: unknown): string => {
  const parts: string[] = []

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    if (typeof record.text === 'string') parts.push(record.text)
    const children = record.children
    if (Array.isArray(children)) children.forEach(walk)
    const root = record.root
    if (root) walk(root)
  }

  walk(value)
  return parts.join(' ')
}

const message = (offences: CopyOffence[]): string => {
  const words = offences.filter((o) => o.kind === 'word').map((o) => `"${o.term}"`)
  const patterns = offences.filter((o) => o.kind === 'pattern').map((o) => o.term)
  const found = [...words, ...patterns].join(', ')
  return `Banned by the positioning doc: ${found}. Trade the adjective for a decision, or the noun for a number.`
}

/** For `text` and `textarea` fields. */
export const noBannedCopy: TextFieldValidation & TextareaFieldValidation = (value) => {
  if (rulesDisabled() || typeof value !== 'string' || !value) return true
  const offences = findCopyOffences(value)
  return offences.length === 0 ? true : message(offences)
}

/** For `richText` fields. */
export const noBannedCopyRichText: Validate = (value) => {
  if (rulesDisabled() || !value) return true
  const offences = findCopyOffences(extractLexicalText(value))
  return offences.length === 0 ? true : message(offences)
}

/**
 * "Junior" never appears on this site. The current title is Full Stack Software
 * Engineer, and the doc treats any drift from the CV as credibility damage.
 */
export const noJuniorTitle: TextFieldValidation = (value) => {
  if (typeof value !== 'string' || !value) return true
  if (/\bjunior\b/i.test(value)) {
    return 'The word "Junior" does not appear on this site. Use the title as it reads on the CV.'
  }
  return true
}

/**
 * A project with no link is not ready to be on the site: store, live site, or
 * repository. Validated on the group so the message lands once, not four times.
 */
export const requireAtLeastOneLink: Validate = (value) => {
  const links = (value ?? {}) as Record<string, unknown>
  const filled = ['appStore', 'playStore', 'liveUrl', 'repoUrl'].some((key) => {
    const link = links[key]
    return typeof link === 'string' && link.trim().length > 0
  })
  return filled
    ? true
    : 'Add at least one link: App Store, Play Store, live site, or repository. A project without a link is not ready to be published.'
}

/**
 * A measured number must say how it was measured. The doc is explicit: if it was
 * not measured it does not get written, and if it was, the site says how.
 */
export const requireMeasurementMethod: TextFieldValidation = (value) => {
  if (typeof value === 'string' && value.trim().length >= 8) return true
  return 'Say how this was measured: device, tool, and version. A number without a method does not go on the site.'
}
