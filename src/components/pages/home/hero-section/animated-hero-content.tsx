'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/button'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { RichText } from '@/components/rich-text'
import { CMSIcon } from '@/components/cms-icon'
import { HomePageInfo } from '@/types/HomePageInfo'

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.13 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }
}

type AnimatedHeroContentProps = {
    homeInfo: HomePageInfo
}

export function AnimatedHeroContent({ homeInfo }: AnimatedHeroContentProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-[600px] pt-28 md:pt-0"
        >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-7">
                <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-emerald-400/50">
                    01 · Portfolio
                </span>
                <div className="h-px w-16 bg-emerald-500/20" />
                <span className="font-mono text-[11px] text-emerald-400/30">2026</span>
            </motion.div>

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

            <motion.div variants={itemVariants} className="mt-5">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-950/25 px-4 py-1.5 backdrop-blur-sm">
                    <motion.span
                        className="block w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                        animate={{ opacity: [1, 0.25, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="font-mono text-sm text-emerald-300 tracking-widest">
                        {homeInfo.heroRoleTag}
                    </span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 max-w-[470px]">
                <div className="border-l-2 border-emerald-500/30 pl-4 text-gray-400 text-sm leading-relaxed">
                    <RichText content={homeInfo.introduction.raw} />
                </div>
            </motion.div>

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
    )
}
