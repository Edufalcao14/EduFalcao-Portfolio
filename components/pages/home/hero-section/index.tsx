'use client';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Animations/fadeIn";
import Image from "next/image"
import { Button } from "@/components/button"
import { HiArrowNarrowRight } from 'react-icons/hi'
import { ParticlesContainer } from "@/components/ParticlesContainer";
import { HomePageInfo } from '@/types/HomePageInfo';
import { RichText } from '@/components/rich-text';
import { CMSIcon } from '@/components/cms-icon';

type HomeSectionProps = {
    homeInfo: HomePageInfo
}

export const HeroSection = ({ homeInfo }: HomeSectionProps) => {
    return (
        <section className="w-full h-screen bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col sm:pb-38 lg:pt-40 pt-20 lg:pb-[110px] overflow-hidden relative -z-5">
            <div className="container flex items-start justify-between flex-col-reverse md:flex-row lg:flex-row relative z-20">
                <motion.div
                    variants={fadeIn("down", 0.4)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="">
                    <div className="max-w-[580px] lg:max-w-[530px] pt-32 md:pt-6 relative z-20">
                        <div className="backdrop-blur-sm rounded-2xl p-6">
                            <p className="font-mono text-2xl text-emerald-400 sm:text-center">Welcome to my Portfolio !</p>
                            <h2 className="font-mono font-bold text-5xl mt-2">Hello, My name is Eduardo Falcao</h2>
                            <h1 className="font-mono text-md mt-3 text-emerald-100">Full Stack Developer</h1>
                            <div>
                                <div className="text-gray-400 text-2xl my-4 text-sm sm:text-base">
                                    <RichText content={homeInfo.introduction.raw} />
                                </div>
                                <div className="my-6 lg:mt-3 flex sm:items-center gap-5 flex-col sm:flex-row">
                                    <Link href={"/resume"}>
                                        <Button className="w-max shadow-button">
                                            More about me
                                            <HiArrowNarrowRight size={18} />
                                        </Button>
                                    </Link>
                                    <div className="text-2xl text-gray-600 flex sm:items-center h-20 gap-3">
                                        {homeInfo.socials.map((contact, i) => (
                                            <a
                                                href={contact.url}
                                                key={`contact-${i}`}
                                                target="_blank"
                                                className="hover:text-gray-100 transition-colors"
                                                rel="noopener noreferrer"
                                            >
                                                <CMSIcon icon={contact.iconSvg} />
                                            </a>
                                        ))}
                                    </div>
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
                    className="sm:opacity-25 justify-center -z-5">
                    <Image
                        width={552}
                        height={520}
                        src="/images/avatar.webp"
                        alt="Profile's picture"
                        className="opacity-15 absolute lg:relative lg:opacity-35 md:relative md:opacity-35 -z-5 w-[402px] lg:w-[522px]"
                    />
                </motion.div>
            </div>
            <ParticlesContainer opacityScale={1} positioning="absolute" />
        </section>
    )
}
