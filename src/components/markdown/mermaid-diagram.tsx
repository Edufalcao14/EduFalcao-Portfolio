'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The one component on this site that ships JavaScript to the reader.
 *
 * Mermaid has no server renderer that does not involve a headless browser, so
 * this is client-side by necessity. The import is dynamic and inside the effect,
 * which means the library is fetched only by pages that actually contain a
 * diagram — an article of prose and code pays nothing.
 *
 * Invalid diagram source renders as an error block with the source visible.
 * A typo in a diagram must not be able to take down the page it is on.
 */

let idCounter = 0

const THEME_VARIABLES = {
  background: '#0b0f0e',
  primaryColor: '#062e26',
  primaryTextColor: '#d1fae5',
  primaryBorderColor: '#34d399',
  lineColor: '#6b7280',
  secondaryColor: '#111827',
  tertiaryColor: '#0f172a',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '13px',
}

type MermaidDiagramProps = {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Renders are async; a fast re-render must not let a stale result win.
  const latest = useRef(0)

  useEffect(() => {
    const attempt = ++latest.current
    let cancelled = false

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          darkMode: true,
          themeVariables: THEME_VARIABLES,
          // The diagram is inside a text column, not a canvas.
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true },
        })

        idCounter += 1
        const { svg: rendered } = await mermaid.render(`mermaid-${idCounter}`, chart)
        if (!cancelled && attempt === latest.current) setSvg(rendered)
      } catch (cause) {
        if (cancelled || attempt !== latest.current) return
        setError(cause instanceof Error ? cause.message : 'The diagram could not be rendered.')
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <figure className="my-6 overflow-hidden rounded-lg border border-amber-500/40 bg-amber-950/20">
        <figcaption className="border-b border-amber-500/30 px-4 py-2 font-mono text-xs text-amber-300/90">
          This diagram could not be rendered: {error}
        </figcaption>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-gray-400">
          {chart}
        </pre>
      </figure>
    )
  }

  return (
    <figure className="my-6 overflow-x-auto rounded-lg border border-gray-800 bg-[#0b0f0e] p-4">
      {svg ? (
        <div className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        // Holds the space so the paragraph below does not jump when the diagram
        // arrives.
        <div className="flex h-32 items-center justify-center font-mono text-xs text-gray-600">
          drawing diagram…
        </div>
      )}
    </figure>
  )
}
