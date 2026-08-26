/**
 * Formatting shared by the list and the case page.
 *
 * These lived inside `project-details` and were deleted when the facts rail lost
 * its period column. The list needs the same two, so they belong here rather
 * than being written a second time with slightly different rules.
 */

/** "Mar 2026". Month precision, because the CMS date picker is month-only. */
export const formatMonth = (value?: string): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/**
 * "Mar 2026 → ongoing". An empty end date means the work is still running,
 * which the CMS states by leaving the field blank.
 */
export const formatPeriod = (start?: string, end?: string): string | null => {
  const from = formatMonth(start)
  if (!from) return null
  return `${from} → ${formatMonth(end) ?? 'ongoing'}`
}

/** "2026". The list has room for a year, not a range. */
export const formatYear = (value?: string): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return String(date.getUTCFullYear())
}

/**
 * The first sentence of a summary.
 *
 * The card used to print the whole thing, five paragraphs included, which at
 * list scale is text nobody reads. One sentence is the unit that survives being
 * scanned. The full summary is still on the case page, where a reader has
 * already chosen to spend attention.
 *
 * Falls back to the first line, then to the whole string, so a summary written
 * without terminal punctuation still renders something.
 */
export const firstSentence = (text: string): string => {
  const flat = (text.split(/\n\s*\n/)[0] ?? text).trim().replace(/\s*\n\s*/g, ' ')
  // The lookbehind keeps the terminator; the boundary is a space plus a capital,
  // so "Node.js" and "art. 11" do not end a sentence.
  const match = flat.match(/^.*?[.!?](?=\s+[A-Z(]|$)/)
  return (match?.[0] ?? flat).trim()
}
