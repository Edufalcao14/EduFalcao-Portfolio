"use client";
import React from 'react';
import { ContactForm } from "@/components/pages/contact/contact-form";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Animations/fadeIn";

const Contact = () => {
    return (
        <motion.div
            variants={fadeIn("down", 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="">
            <section className="h-max bg-hero-image bg-cover bg-center bg-no-repeat">
                <ContactForm />
            </section>
        </motion.div>
    );
}


export default Contact;
