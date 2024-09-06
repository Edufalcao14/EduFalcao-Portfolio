import React from 'react';
import { ContactForm } from "@/components/pages/contact/contact-form";

export const metadata = {
    title: 'Contact',
    description: 'Portfolio',
  };

const Contact = () => {
    return (
            <section className="h-max bg-hero-image bg-cover bg-center bg-no-repeat overflow-hidden">
                <ContactForm />
            </section>
    );
}


export default Contact;
