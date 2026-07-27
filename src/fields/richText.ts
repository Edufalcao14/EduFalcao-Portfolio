import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Deliberately restricted toolbars.
 *
 * A rich text field that can do anything produces pages that look like anything.
 * Underline, alignment, colour and tables are left out: the frontend has no
 * styling for them, so offering them in the panel would promise something the
 * site cannot deliver.
 */

/** Prose: intros, experience entries, the about text. */
export const proseEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    InlineCodeFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    InlineToolbarFeature(),
  ],
})

/** The case study body. Headings, because the case template is six sections. */
export const caseEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    BoldFeature(),
    ItalicFeature(),
    InlineCodeFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
