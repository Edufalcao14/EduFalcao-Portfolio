"use client";
import { SectionTitle } from "@/components/section-title";
import { Link } from "@/components/Link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Animations/fadeIn";

type introductionProps = {
    mainText: string
}

export const PageIntroduction = ({ mainText }: introductionProps) => {
    return (

        <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.7 }}
    >
            <section className="w-full h-[450px] lg:h[630px] pt-32 flex flex-col items-center justify-center px-2">
                <SectionTitle
                    subtitle="Projects"
                    title="My Projects"
                    className="text-center items-center [&>h3]:text-4xl"
                />
                <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-center max-w-[640px] my-6 text-sm sm:text-base">
                        {mainText}
                    </p>
                    <Link href={"/"}>
                        <HiArrowNarrowLeft />
                        Go Back to Home
                    </Link>
                </div>
            </section>

        </motion.div >
    )
}