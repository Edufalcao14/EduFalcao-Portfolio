"use client";
import { motion } from "framer-motion";
import { HorizontalDivider } from "@/components/divider/horizontal";
import { Resume } from "@/components/pages/resume/tabAboutMe/resume";
import { WorkExperience } from "@/components/pages/resume/workExperience/workExperience";

const Page = () => {
    return (
        <section className="bg-hero-image bg-cover bg-center bg-no-repeat">
            <Resume />
            <WorkExperience />
            
        </section>
    );
};

export default Page;
