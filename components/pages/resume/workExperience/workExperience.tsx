"use client";
import { SectionTitle } from "@/components/section-title";
import React from 'react';
import { ExperienceItem } from "./experienceItem";
import { motion } from "framer-motion";

export const WorkExperience = () => {

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
            <section className="container py-5 flex lg:gap-16 md:gap-4 sm:gap-10 flex-col md:flex-row">


                <div className=" max-w-[420px] ">
                    <SectionTitle title="Professional and Academic Experiences" subtitle={"Experiences"} />
                    <p className="text-gray-400 mt-6 pb-5">
                        I'm always open to new challenges and exciting projects. Let's work together to create amazing solutions for your company!
                    </p>
                </div>
                <div className="flex flex-col gap-4 ">
                    <ExperienceItem />
                    <ExperienceItem />
                </div>
            

            </section>
        </motion.div>

    )
}