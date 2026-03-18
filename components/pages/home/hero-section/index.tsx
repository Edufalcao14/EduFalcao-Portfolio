'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
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

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.13 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }
};

const BLOB_SHAPES = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 40% 70% 30% 60%',
    '50% 50% 30% 70% / 60% 40% 60% 40%',
    '60% 40% 60% 40% / 30% 60% 40% 70%',
];

export const HeroSection = ({ homeInfo }: HomeSectionProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [blobIdx, setBlobIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setBlobIdx(i => (i + 1) % BLOB_SHAPES.length), 3200);
        return () => clearInterval(id);
    }, []);

    const currentBlob = BLOB_SHAPES[blobIdx];
    const nextBlob = BLOB_SHAPES[(blobIdx + 1) % BLOB_SHAPES.length];

    return (
        <section className="w-full h-screen bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col justify-center overflow-hidden relative">

            {/* Subtle grid texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="container flex items-center justify-between flex-col-reverse md:flex-row relative z-20 gap-2">

                {/* ── LEFT: Content ── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex-1 max-w-[600px] pt-28 md:pt-0"
                >
                    {/* Editorial label row */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-emerald-400/50">
                            01 · Portfolio
                        </span>
                        <div className="h-px w-16 bg-emerald-500/20" />
                        <span className="font-mono text-[11px] text-emerald-400/30">2026</span>
                    </motion.div>

                    {/* Name — typographic anchor */}
                    <motion.div variants={itemVariants}>
                        <h1
                            className="font-mono font-bold leading-[0.92] tracking-tight"
                            style={{ fontSize: 'clamp(3rem, 5.5vw, 5.25rem)' }}
                        >
                            <span className="block text-gray-50">Eduardo</span>
                            <span
                                className="block"
                                style={{
                                    color: 'transparent',
                                    WebkitTextStroke: '1.5px rgba(52, 211, 153, 0.75)',
                                }}
                            >
                                Falcao
                            </span>
                        </h1>
                    </motion.div>

                    {/* Role badge */}
                    <motion.div variants={itemVariants} className="mt-5">
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-950/25 px-4 py-1.5 backdrop-blur-sm">
                            <motion.span
                                className="block w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                                animate={{ opacity: [1, 0.25, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <span className="font-mono text-sm text-emerald-300 tracking-widest">
                                Full Stack Developer
                            </span>
                        </div>
                    </motion.div>

                    {/* Description with left accent */}
                    <motion.div variants={itemVariants} className="mt-6 max-w-[470px]">
                        <div className="border-l-2 border-emerald-500/30 pl-4 text-gray-400 text-sm leading-relaxed">
                            <RichText content={homeInfo.introduction.raw} />
                        </div>
                    </motion.div>

                    {/* CTA row */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 flex items-center gap-5 flex-wrap"
                    >
                        <Link href={"/resume"}>
                            <Button className="w-max shadow-button group">
                                More about me
                                <HiArrowNarrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform duration-200"
                                />
                            </Button>
                        </Link>

                        <div className="hidden sm:block w-px h-5 bg-gray-700/60" />

                        {/* Socials */}
                        <div className="flex items-center gap-4">
                            {homeInfo.socials.map((contact, i) => (
                                <a
                                    href={contact.url}
                                    key={`contact-${i}`}
                                    target="_blank"
                                    className="text-gray-500 hover:text-emerald-400 transition-all duration-200 hover:-translate-y-0.5"
                                    rel="noopener noreferrer"
                                >
                                    <CMSIcon icon={contact.iconSvg} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* ── RIGHT: Image ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    className="hidden md:flex justify-center items-center flex-shrink-0"
                >
                    {/* Floating wrapper */}
                    <motion.div
                        className="relative flex items-center justify-center"
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Orbit ring 1 — clockwise */}
                        <motion.div
                            className="absolute rounded-full border border-emerald-500/20"
                            style={{ width: '480px', height: '480px' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                            <motion.div
                                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400"
                                animate={{
                                    boxShadow: isHovered
                                        ? '0 0 14px 5px rgba(52, 211, 153, 0.9)'
                                        : '0 0 6px 2px rgba(52, 211, 153, 0.5)',
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Orbit ring 2 — counter, dashed */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: '430px',
                                height: '430px',
                                border: '1px dashed rgba(16, 185, 129, 0.18)',
                            }}
                            animate={{ rotate: -360 }}
                            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        >
                            <motion.div
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-600"
                                animate={{
                                    boxShadow: isHovered
                                        ? '0 0 10px 3px rgba(5, 150, 105, 0.9)'
                                        : '0 0 4px 1px rgba(5, 150, 105, 0.3)',
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Ambient glow — morphs with blob */}
                        <motion.div
                            className="absolute"
                            style={{ width: '380px', height: '380px' }}
                            animate={{
                                borderRadius: nextBlob,
                                boxShadow: isHovered
                                    ? '0 0 80px 30px rgba(5, 150, 105, 0.4), 0 0 140px 60px rgba(5, 150, 105, 0.12)'
                                    : '0 0 40px 12px rgba(5, 150, 105, 0.18)',
                            }}
                            transition={{ duration: 3.2, ease: 'easeInOut' }}
                        />

                        {/* Rotating arc border — morphs with blob */}
                        <motion.div
                            className="absolute"
                            style={{ width: '386px', height: '386px', borderRadius: currentBlob }}
                            animate={{
                                rotate: 360,
                                borderRadius: nextBlob,
                            }}
                            transition={{
                                rotate: { duration: isHovered ? 2 : 4, repeat: Infinity, ease: 'linear' },
                                borderRadius: { duration: 3.2, ease: 'easeInOut' },
                            }}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0%, #059669 18%, #34d399 30%, transparent 52%)',
                                    padding: '2.5px',
                                    borderRadius: 'inherit',
                                }}
                            />
                        </motion.div>

                        {/* Image blob — morphs shape */}
                        <motion.div
                            className="relative overflow-hidden bg-gray-950 z-10"
                            style={{ width: '380px', height: '380px', borderRadius: currentBlob }}
                            animate={{
                                borderRadius: nextBlob,
                                scale: isHovered ? 1.04 : 1,
                            }}
                            transition={{
                                borderRadius: { duration: 3.2, ease: 'easeInOut' },
                                scale: { duration: 0.4, ease: 'easeOut' },
                            }}
                        >
                            <Image
                                fill
                                src="/images/professional_picture.png"
                                alt="Eduardo Falcao - Full Stack Developer"
                                className="object-cover object-top"
                            />

                            {/* Hover tint */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    background: isHovered
                                        ? 'linear-gradient(to top, rgba(5, 150, 105, 0.3) 0%, transparent 55%)'
                                        : 'linear-gradient(to top, rgba(5, 150, 105, 0) 0%, transparent 55%)',
                                }}
                                transition={{ duration: 0.35 }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <ParticlesContainer opacityScale={1} positioning="absolute" />
        </section>
    );
};
