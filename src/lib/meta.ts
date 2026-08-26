/**
 * Turns a case summary into a meta description.
 *
 * The summary is now allowed to be several paragraphs, because it is read on the
 * page. A search result is not: Google truncates around 160 characters, and a
 * description that is cut mid-clause reads as broken. So this takes whole
 * sentences from the front until the next one would not fit, and only falls back
 * to a word-boundary cut if the very first sentence is already too long.
 */
const META_DESCRIPTION_LIMIT = 160

export const toMetaDescription = (
  text: string | null | undefined,
  limit = META_DESCRIPTION_LIMIT,
): string => {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim()
  if (flat.length <= limit) return flat

  // Keep the delimiter on the sentence it ends, so nothing is lost when joined.
  const sentences = flat.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((part) => part.trim()) ?? []

  let out = ''
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence
    if (next.length > limit) break
    out = next
  }
  if (out) return out

  // First sentence alone overflows: cut on a word boundary and mark the cut.
  const clipped = flat.slice(0, limit - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:]$/, '')}…`
}
