'use client';

import Link from 'next/link';
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Animations/fadeIn";
import { TechBagde } from "@/components/tech-bagde"
import Image from "next/image"
import { Button } from "@/components/button"
import { HiArrowNarrowRight } from 'react-icons/hi'
import { TbBrandGithub, TbBrandLinkedin, TbBrandWhatsapp } from 'react-icons/tb'
import ParticlesContainer from "@/components/ParticlesContainer"


const MOCK_CONTACTS = [
    {
        url: 'https://github.com/Edufalcao14',
        icon: <TbBrandGithub size={32} />
    },
    {
        url: 'https://www.linkedin.com/in/edusampaiofalcao/',
        icon: <TbBrandLinkedin size={32} />
    },
    {
        url: 'https://wa.me/320465256614?text=Hello%20Eduardo%20Falc%C3%A3o%2C%0A%0AI%20hope%20this%20message%20finds%20you%20well.%20I%E2%80%99m%20interested%20in%20learning%20more%20about%20your%20work.%20Could%20we%20discuss%20it%20further%3F%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D',
        icon: <TbBrandWhatsapp size={32} />
    },
]
const MOCK_MAIN_TECHS = [
    { name: 'Java' },
    { name: 'TypeScript' },
    { name: 'React.js' },
    { name: 'Next.js' },
    { name: 'Spring Boot' },
    { name: 'Postgre SQL' },
];

export const HeroSection = () => {
    return (
        <section className="w-full lg:h-[900px]  bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col justify-end sm:pb-38 pt-32 lg:pb-[110px]">
            <div className="container flex items-start justify-between flex-col-reverse md:flex-row lg:flex-row">
                <motion.div
                    variants={fadeIn("down", 0.4)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className=""
                >
                    <div className=" max-w-[530px] lg:max-w-[530px] ">
                        
                        <p className="font-mono text-2xl text-emerald-400">Welcome to my Portfolio !</p>
                        <h2 className="font-mono font-bold text-5xl mt-2"> Hello, My name is Eduardo Falcao</h2>
                        <h1 className="font-mono text-md mt-3 text-emerald-100 ">Full Stack Developer</h1>
                        <div >
                            <p className="text-gray-400 text-2xl my-4 text-sm sm:text-base ">
                                Specializing in full-stack development to create powerful, high-performance applications tailored for impactful solutions.
                            </p>
                            <div className="flex flex-wrap gap-x-2 gap-y-3 lg:max-w-[340px]">
                                {MOCK_MAIN_TECHS.map((tech, index) => (
                                    <TechBagde name={tech.name} key={index} />
                                ))}
                            </div>
                            <div className="mt-6 lg:mt-10 flex sm:items-center sm:gap-5 flex-col sm:flex-row">
                                <Link href={"/resume"}>
                                <Button className=" w-max shadow-button">
                                    More about me
                                    <HiArrowNarrowRight size={18} />
                                </Button>
                                </Link>
                                <div className="text-2xl text-gray-600 flex items-center h-20 gap-3">
                                    {MOCK_CONTACTS.map((contact, index) => (
                                        <a href={contact.url} key={`contact-${index}`} target="_blank" className="text-white hover:text-emerald-400 transition-colors">
                                            {contact.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="sm:opacity-25 justify-center">
                    <Image
                        width={402}
                        height={420}
                        src="/images/avatar.webp"
                        alt="Profile's picture"
                        className=" opacity-15  absolute lg:relative lg:opacity-45 md:relative md:opacity-35"
                    />
                </motion.div>
            </div>
            <ParticlesContainer />
        </section>
    )
}