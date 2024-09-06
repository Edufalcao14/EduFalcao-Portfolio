import { motion } from "framer-motion";
import { HorizontalDivider } from "@/components/divider/horizontal";
import { Resume } from "@/components/pages/resume/tabAboutMe";
import { WorkExperience } from "@/components/pages/resume/workExperience/index";
import { ContactForm } from "@/components/pages/contact/contact-form";
export const metadata = {
    title: 'Resume',
    description: 'Portfolio',
  };

const Page = () => {
    return (
        <section className="bg-hero-image bg-cover bg-center bg-no-repeat">
            <Resume />
            <WorkExperience />
        </section>
    );
};

export default Page;
