/**
 * The case study template from section 6 of the positioning doc, pre-filled as
 * the default body of a new case.
 *
 * It is a starting point, not a cage: the body is one rich text field, so the
 * headings can be renamed, reordered or deleted. Having them on screen means the
 * template does not have to be remembered.
 */

const TEMPLATE: { heading: string; hint: string }[] = [
  { heading: 'Context', hint: 'One line: which product, what scale, my role.' },
  { heading: 'Problem', hint: 'What was broken or missing, with the bad number.' },
  {
    heading: 'Constraint',
    hint: 'What I could not change: client, deadline, legacy, compliance.',
  },
  {
    heading: 'Decision',
    hint: 'What I did and why, including the alternative I rejected.',
  },
  { heading: 'Tradeoff', hint: 'What this choice cost.' },
  { heading: 'Result', hint: 'The number after, and how it was measured.' },
]

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (text = '') => ({
  type: 'paragraph',
  children: text ? [textNode(text)] : [],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (text: string) => ({
  type: 'heading',
  tag: 'h2',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

export const caseTemplateValue = () => ({
  root: {
    type: 'root',
    children: TEMPLATE.flatMap(({ heading: h, hint }) => [heading(h), paragraph(hint)]),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
