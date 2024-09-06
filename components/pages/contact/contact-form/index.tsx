"use client";
import React, { useState } from 'react';
import { SectionTitle } from "../../../section-title";
import { Button } from "../../../button";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ParticlesContainer from "@/components/ParticlesContainer";
import { sendContactForm } from '@/lib/api';
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Animations/fadeIn";
import Swal from 'sweetalert2'

const contactFormSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    message: z.string().min(1).max(500)
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {

    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, register } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema)
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsLoading(true);
        let response;
        try {
           
            response = await sendContactForm(data);
        } catch (err) {
            console.error("Failed to send contact form:", err);
            Swal.fire({
                toast: true,
                position: "center",
                icon: "error",
                text: (err as Error).message,
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } finally {
            setIsLoading(false);
        }
        if (response.message === "Email sent successfully!") {
            setIsLoading(false);
            Swal.fire({
                toast: true,
                position: "center",
                icon: "success",
                text: response.message,
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };
    return (
        <motion.div
            variants={fadeIn("down", 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="">
            <section className="py-32  xxl:py-60  px-6 md:py-32 flex lg:mt-18 xl:pb-60 overflow-hidden flex flex-row">
                <div className="w-full max-w-[420px] mx-auto">
                    <SectionTitle
                        subtitle="Contact"
                        title="Let's work together?"
                        className=""
                    />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-12 flex flex-col gap-4"
                    >
                        <input
                            placeholder="Name"
                            type="text"
                            className="w-full h-14 bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-emerald-600"
                            {...register("name")}
                        />
                        <input
                            placeholder="E-Mail"
                            type="text"
                            className="w-full h-14 bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-emerald-600"
                            {...register("email")}
                        />
                        <textarea
                            placeholder="Message"
                            className="resize-none w-full h-[138px] bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-emerald-600"
                            maxLength={500}
                            {...register("message")}
                        />
                        <Button
                            className="w-max mx-auto mt-6 shadow-button"
                            type="submit"
                            disabled={isLoading} // Optionally disable the button while loading
                        >
                            {isLoading ? "Sending..." : "Send Message"}
                            <HiArrowNarrowRight size={18} />
                        </Button>
                    </form>
                </div>
                <ParticlesContainer />
            </section>
        </motion.div>
    );
};
