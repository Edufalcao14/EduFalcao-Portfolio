'use client';
import Link from 'next/link';
import { useState } from 'react';
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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="w-full h-screen bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col sm:pb-38 lg:pt-40 pt-20 lg:pb-[110px] overflow-hidden relative -z-5">
            <div className="container flex items-center justify-between flex-col-reverse md:flex-row lg:flex-row relative z-20 gap-8">
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
                    className="hidden md:flex justify-center items-center flex-shrink-0 pt-28 md:pt-6"
                >
                    {/* Floating wrapper */}
                    <motion.div
                        className="relative flex items-center justify-center"
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Orbit ring 1 — slow clockwise */}
                        <motion.div
                            className="absolute rounded-full border border-emerald-500/25"
                            style={{ width: '420px', height: '420px' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                            {/* Satellite dot */}
                            <motion.div
                                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400"
                                animate={{
                                    boxShadow: isHovered
                                        ? '0 0 12px 4px rgba(52, 211, 153, 0.9)'
                                        : '0 0 6px 2px rgba(52, 211, 153, 0.5)',
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Orbit ring 2 — counter-clockwise, dashed */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: '370px',
                                height: '370px',
                                border: '1px dashed rgba(16, 185, 129, 0.2)',
                            }}
                            animate={{ rotate: -360 }}
                            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                        >
                            {/* Satellite dot */}
                            <motion.div
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-600"
                                animate={{
                                    boxShadow: isHovered
                                        ? '0 0 8px 3px rgba(5, 150, 105, 0.8)'
                                        : '0 0 4px 1px rgba(5, 150, 105, 0.3)',
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Ambient glow behind the circle */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{ width: '320px', height: '320px' }}
                            animate={{
                                boxShadow: isHovered
                                    ? '0 0 70px 25px rgba(5, 150, 105, 0.45), 0 0 120px 50px rgba(5, 150, 105, 0.15)'
                                    : '0 0 35px 10px rgba(5, 150, 105, 0.2)',
                            }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Rotating arc border (conic gradient wrapping the image) */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{ width: '326px', height: '326px' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: isHovered ? 2 : 4, repeat: Infinity, ease: 'linear' }}
                        >
                            <div
                                className="w-full h-full rounded-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0%, #059669 20%, #34d399 32%, transparent 55%)',
                                    padding: '3px',
                                }}
                            />
                        </motion.div>

                        {/* Image circle */}
                        <motion.div
                            className="relative rounded-full overflow-hidden bg-gray-950 z-10"
                            style={{ width: '320px', height: '320px' }}
                            animate={{ scale: isHovered ? 1.04 : 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <Image
                                fill
                                src="/images/professional_picture.png"
                                alt="Eduardo Falcao - Professional Picture"
                                className="object-cover object-top"
                            />

                            {/* Hover tint overlay */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                animate={{
                                    background: isHovered
                                        ? 'linear-gradient(to top, rgba(5, 150, 105, 0.28) 0%, transparent 60%)'
                                        : 'linear-gradient(to top, rgba(5, 150, 105, 0) 0%, transparent 60%)',
                                }}
                                transition={{ duration: 0.35 }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            <ParticlesContainer opacityScale={1} positioning="absolute" />
        </section>
    )
}
