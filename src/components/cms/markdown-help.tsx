'use client'

import { useState } from 'react'

/**
 * The authoring cheatsheet, in the panel.
 *
 * `docs/writing-articles.md` is the full version, but a document in the repo is
 * not much use to someone typing into a field in a browser. This is the same
 * information at the moment it is needed. It stays collapsed so it does not
 * push the editor down the page.
 *
 * Inline styles rather than classes: the admin panel does not load the site's
 * Tailwind, and Payload's own class names are private to Payload.
 */

const SNIPPETS: { label: string; code: string; note?: string }[] = [
  {
    label: 'Headings, prose, lists',
    code: `## A section heading\n\nProse, with **bold**, *italic*, \`inline code\`\nand [a link](https://example.com).\n\n- a bullet\n1. a numbered item\n\n> a pull quote`,
    note: 'Start at ##. The title is already the h1.',
  },
  {
    label: 'Code, with an optional filename',
    code: '```ts title="src/lib/revalidate.ts"\nexport const revalidateOnChange = ({ doc }) => { ... }\n```',
    note: 'Highlighted on the server: costs the reader no JavaScript.',
  },
  {
    label: 'Mermaid diagram',
    code: '```mermaid\nflowchart LR\n  CMS -->|afterChange| Purge --> Page\n```',
    note: 'Themed to the site. Invalid source shows an error block, it never breaks the page.',
  },
  {
    label: 'Image or Excalidraw drawing',
    code: '![How the token refresh works](media:auth-flow.svg)',
    note: 'Attach the file in Media below first, then reference it by filename. Excalidraw: export as SVG with a transparent background — there is no special syntax.',
  },
  {
    label: 'Table',
    code: '| Field | Type |\n| --- | --- |\n| title | text |',
  },
]

export function MarkdownHelp() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: '.35rem' }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '.45rem',
          padding: '.2rem .5rem .2rem .25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'currentColor',
          font: 'inherit',
          opacity: 0.85,
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.15rem',
            height: '1.15rem',
            borderRadius: '50%',
            border: '1px solid currentColor',
            fontSize: '.72rem',
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          i
        </span>
        <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {open ? 'Hide the markdown guide' : 'How to write this'}
        </span>
      </button>

      {open && (
        <div
          style={{
            marginTop: '.6rem',
            padding: '.9rem 1rem',
            border: '1px solid rgba(128,128,128,.35)',
            borderRadius: '4px',
            fontSize: '.8rem',
            lineHeight: 1.55,
          }}
        >
          <p style={{ margin: '0 0 .9rem' }}>
            This field is <strong>Markdown</strong>. Write it here or paste a finished
            document in from Obsidian. Raw HTML is stripped. The full version of this guide
            is in <code>docs/writing-articles.md</code>.
          </p>

          {SNIPPETS.map((snippet) => (
            <div key={snippet.label} style={{ marginBottom: '.9rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '.3rem' }}>{snippet.label}</div>
              <pre
                style={{
                  margin: 0,
                  padding: '.6rem .7rem',
                  overflowX: 'auto',
                  background: 'rgba(128,128,128,.12)',
                  borderRadius: '3px',
                  fontSize: '.75rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre',
                }}
              >
                {snippet.code}
              </pre>
              {snippet.note && (
                <div style={{ marginTop: '.3rem', opacity: 0.75 }}>{snippet.note}</div>
              )}
            </div>
          ))}

          <p style={{ margin: 0, opacity: 0.75 }}>
            Publishing purges the cache, so the article is live on the next request.
          </p>
        </div>
      )}
    </div>
  )
}
