import React from 'react'
import type { Metadata } from 'next'
import { ContactForm } from "@/components/pages/contact/contact-form"

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Portfolio',
}

const Contact = () => {
  return (
    <section className="h-max bg-hero-image bg-cover bg-center bg-no-repeat overflow-hidden">
      <ContactForm />
    </section>
  )
}

export default Contact
