import type { Element } from 'hast'
import ReactMarkdown, { type Components, defaultUrlTransform } from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { CodeBlock } from './code-block'
import { MermaidDiagram } from './mermaid-diagram'
import type { ArticleImage } from '@/types/ArticlesInfo'

/**
 * Markdown to a page.
 *
 * Raw HTML is not enabled, which is not a limitation so much as the security
 * model: there is no path from the body field to arbitrary markup, so there is
 * no sanitizer to get wrong. Everything an article needs is a markdown
 * construct or a fenced block.
 *
 * The element styling matches `src/components/rich-text`, so an article and a
 * case body read as the same site.
 */

/** `![alt](media:diagram.svg)` resolves against the images attached to the article. */
const MEDIA_PREFIX = 'media:'

/**
 * `media:` has to survive URL sanitizing.
 *
 * react-markdown drops any URL whose protocol is not on its safe list, which is
 * the behaviour you want for `javascript:` and exactly not what you want for our
 * own scheme: it silently emptied every image's src. Anything that is not
 * `media:` still goes through the default transform, so the protection stays.
 */
const urlTransform = (url: string) =>
  url.startsWith(MEDIA_PREFIX) ? url : defaultUrlTransform(url)

/**
 * Drops raw HTML instead of showing it.
 *
 * With HTML disabled, react-markdown renders an `<html>` mdast node as escaped
 * text, so a stray tag appears on the page as literal `&lt;script&gt;`. Removing
 * the nodes is what the authoring guide promises, and it keeps a pasted document
 * full of editor markup from looking broken.
 */
const remarkStripHtml = () => (tree: unknown) => {
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const parent = node as { children?: unknown[] }
    if (!Array.isArray(parent.children)) return
    parent.children = parent.children.filter(
      (child) => (child as { type?: string })?.type !== 'html',
    )
    parent.children.forEach(walk)
  }
  walk(tree)
}

const buildComponents = (images: ArticleImage[]): Components => {
  const byFilename = new Map(images.map((image) => [image.filename, image]))

  return {
    h2: ({ children, id }) => (
      <h2
        id={id}
        className="mt-12 mb-4 scroll-mt-24 font-mono text-xl font-bold text-gray-100 first:mt-0"
      >
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} className="mt-8 mb-3 scroll-mt-24 font-mono text-lg font-semibold text-gray-200">
        {children}
      </h3>
    ),
    h4: ({ children, id }) => (
      <h4 id={id} className="mt-6 mb-2 scroll-mt-24 font-mono text-base font-semibold text-gray-200">
        {children}
      </h4>
    ),
    /**
     * A paragraph whose whole content is an image renders without the `<p>`.
     *
     * Markdown wraps a lone image in a paragraph, and the image renders as a
     * `<figure>` with a caption. A figure inside a paragraph is invalid HTML,
     * which the browser silently re-parents — and that mismatch fails
     * hydration, throwing away the rendered tree and rebuilding it on the
     * client. Unwrapping keeps the figure semantics and the markup legal.
     */
    p: ({ children, node }) => {
      const parts = node?.children ?? []
      const meaningful = parts.filter(
        (part) => part.type !== 'text' || part.value.trim().length > 0,
      )
      const onlyImages =
        meaningful.length > 0 &&
        meaningful.every((part) => part.type === 'element' && part.tagName === 'img')

      if (onlyImages) return <>{children}</>
      return <p className="mb-5 leading-relaxed text-gray-300">{children}</p>
    },
    a: ({ children, href }) => (
      <a
        href={href}
        // An article links out; a link that leaves keeps the reader's place here.
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 transition-colors hover:decoration-emerald-400"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-gray-100">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
    del: ({ children }) => <del className="text-gray-500 line-through">{children}</del>,
    hr: () => <hr className="my-10 border-gray-800" />,
    // The bullet and the number both come from `.markdown` in globals.css: only a
    // parent selector can tell a `ul` item from an `ol` item.
    ul: ({ children }) => <ul className="mb-5 list-none space-y-3">{children}</ul>,
    ol: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-3 pl-6 marker:font-mono marker:text-emerald-400/70">
        {children}
      </ol>
    ),
    li: ({ children, className }) => (
      <li className={`leading-relaxed text-gray-300${className ? ` ${className}` : ''}`}>
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-emerald-500/40 pl-4 italic text-gray-400">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      // Wide tables scroll inside their own box rather than widening the page.
      <div className="my-6 overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-900/60">{children}</thead>,
    th: ({ children }) => (
      <th className="border-b border-gray-800 px-4 py-2.5 text-left font-mono text-xs uppercase tracking-wider text-emerald-400/80">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-gray-800/60 px-4 py-2.5 align-top text-gray-300">
        {children}
      </td>
    ),
    /**
     * Every fenced block is handled here, not in `code`.
     *
     * A fence with no language produces a `<code>` with no class, which is
     * indistinguishable from inline code once you are looking at the `code`
     * element alone — so terminal output and log excerpts were rendering as
     * little inline pills. The `pre` wrapper is the only reliable signal that a
     * block is a block, so the source is read straight off it.
     */
    pre: ({ node }) => {
      const fence = node?.children?.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      )
      if (!fence) return null

      const classes = fence.properties?.className
      const language = /language-([\w-]+)/.exec(
        Array.isArray(classes) ? classes.join(' ') : String(classes ?? ''),
      )?.[1]
      const source = fence.children
        .map((child) => (child.type === 'text' ? child.value : ''))
        .join('')

      if (language === 'mermaid') return <MermaidDiagram chart={source} />

      const meta = (fence.data as { meta?: string } | undefined)?.meta
      return <CodeBlock code={source} language={language} meta={meta} />
    },
    /** Inline only: a fenced block never reaches this, `pre` consumes it. */
    code: ({ children }) => (
      <code className="rounded bg-gray-800/70 px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300">
        {children}
      </code>
    ),
    img: ({ src, alt }) => {
      const reference = typeof src === 'string' ? src : ''
      const attached = reference.startsWith(MEDIA_PREFIX)
        ? byFilename.get(reference.slice(MEDIA_PREFIX.length))
        : undefined

      if (reference.startsWith(MEDIA_PREFIX) && !attached) {
        return (
          <span className="my-6 block rounded-lg border border-amber-500/40 bg-amber-950/20 px-4 py-3 font-mono text-xs text-amber-300/90">
            Missing image: nothing called “{reference.slice(MEDIA_PREFIX.length)}” is attached to
            this article.
          </span>
        )
      }

      const url = attached?.url ?? reference
      const caption = alt ?? attached?.alt ?? ''

      return (
        <figure className="my-8">
          {/* A plain img, not next/image: article images are frequently SVG,
              which the optimizer refuses without `dangerouslyAllowSVG`, and
              these are already sized by the CMS. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={caption}
            width={attached?.width}
            height={attached?.height}
            loading="lazy"
            decoding="async"
            className="mx-auto h-auto max-w-full rounded-lg border border-gray-800"
          />
          {caption && (
            <figcaption className="mt-2.5 text-center font-mono text-xs text-gray-500">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    },
  }
}

type MarkdownProps = {
  content: string
  images?: ArticleImage[]
}

export const Markdown = ({ content, images = [] }: MarkdownProps) => {
  if (!content.trim()) return null
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkStripHtml]}
        rehypePlugins={[rehypeSlug]}
        urlTransform={urlTransform}
        components={buildComponents(images)}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
