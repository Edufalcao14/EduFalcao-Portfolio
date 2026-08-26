/**
 * The rest of the description, after the lede.
 *
 * The summary field is a textarea, so an author writing several paragraphs gets
 * newlines, and HTML collapses those: a five-paragraph description rendered as
 * one wall of text. This splits on blank lines.
 *
 * The first paragraph is not repeated here. It is the lede in the hero, which is
 * where a reader meets the project. So a one-paragraph summary renders nothing
 * at all from this component, and that is the common case for a thin project.
 */

type CaseSummaryProps = {
    text: string
}

/** Blank lines separate paragraphs; a single newline is just a wrapped line. */
const toParagraphs = (text: string): string[] =>
    text
        .split(/\n\s*\n/)
        .map((block) => block.trim().replace(/\s*\n\s*/g, ' '))
        .filter((block) => block.length > 0)

export const CaseSummary = ({ text }: CaseSummaryProps) => {
    const [, ...body] = toParagraphs(text)
    if (body.length === 0) return null

    return (
        <section className="container my-14 sm:my-20">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400 lg:pt-2">
                    The build
                </h2>
                {/* One measure, left aligned. Centred prose at this length gives
                    the eye no fixed point to return to at the start of a line. */}
                <div className="flex max-w-[68ch] flex-col gap-5">
                    {body.map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-base leading-[1.75] text-gray-400"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    )
}
