import React from 'react'
import type { Metadata } from 'next'
import { ContactForm } from "@/components/pages/contact/contact-form"

/**
 * Rendered per request, like every other route here.
 *
 * This page holds no CMS content of its own, but the layout around it does — the
 * header and footer read site settings — so prerendering it made `next build`
 * open a database connection. A build container has none, and worse, Payload
 * greets a dev-pushed schema with an interactive prompt that a build cannot
 * answer, so the export hung until it timed out.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch about mobile engineering work. Available in São Paulo from August 2026.',
}

const Contact = () => {
  return (
    <section className="h-max bg-hero-image bg-cover bg-center bg-no-repeat overflow-hidden">
      <ContactForm />
    </section>
  )
}

export default Contact
