import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

/**
 * Same component, same prop name, different engine.
 *
 * Content now comes from Payload's Lexical editor instead of Hygraph, so the
 * renderer had to be replaced. The styling did not change: every class below is
 * the one the Hygraph version used, so the pages render identically.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mb-2 last:mb-0">{nodesToJSX({ nodes: node.children })}</p>
  ),
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.tag === 'h1') return <h1 className="text-2xl font-bold mb-3">{children}</h1>
    if (node.tag === 'h3') return <h3 className="text-lg font-semibold mb-2">{children}</h3>
    return <h2 className="text-xl font-bold mb-2">{children}</h2>
  },
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.tag === 'ol') return <ol className="list-none space-y-3 my-3">{children}</ol>
    return <ul className="list-none space-y-3 my-3">{children}</ul>
  },
  listitem: ({ node, nodesToJSX }) => (
    <li className="flex items-start gap-3 text-gray-300 leading-relaxed group">
      <span className="mt-[7px] shrink-0 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)] group-hover:scale-125 transition-transform duration-200" />
      </span>
      <span className="flex-1">{nodesToJSX({ nodes: node.children })}</span>
    </li>
  ),
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="border-l-2 border-emerald-500/40 pl-4 my-3 italic">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),
})

type RichTextProps = {
  /** Named `content` so no calling component had to change. */
  content: SerializedEditorState | null | undefined
  className?: string
}

export const RichText = ({ content, className }: RichTextProps) => {
  if (!content) return null
  return <LexicalRichText converters={converters} data={content} className={className} />
}
