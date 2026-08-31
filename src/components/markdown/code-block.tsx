import { bundledLanguages, codeToHtml } from 'shiki'

/**
 * Code, highlighted on the server.
 *
 * Shiki runs at render time and emits styled HTML, so a code block costs the
 * reader nothing: no highlighter bundle, no hydration, no flash of unstyled
 * code. The rendered page is cached, so the cost to us is one highlight per
 * publish rather than one per request.
 */

const THEME = 'github-dark-default'

/** Filenames are worth more than language labels: `title="src/lib/x.ts"`. */
const parseTitle = (meta: string | undefined): string | undefined =>
  meta?.match(/title="([^"]+)"/)?.[1] ?? meta?.match(/title='([^']+)'/)?.[1]

type CodeBlockProps = {
  code: string
  language?: string
  meta?: string
}

export async function CodeBlock({ code, language, meta }: CodeBlockProps) {
  const title = parseTitle(meta)
  // An unknown language is an author's typo, not a reason to fail the page: fall
  // back to plain text, which is what a fence with no language gets anyway.
  const lang = language && language in bundledLanguages ? language : 'text'

  const html = await codeToHtml(code.replace(/\n$/, ''), {
    lang,
    theme: THEME,
  })

  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-gray-800 bg-[#0d1117]">
      {title && (
        <figcaption className="flex items-center gap-2 border-b border-gray-800 px-4 py-2 font-mono text-xs text-gray-400">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
          {title}
        </figcaption>
      )}
      <div
        className="overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
