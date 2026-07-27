'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BLOB_SHAPES = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 40% 70% 30% 60%',
    '50% 50% 30% 70% / 60% 40% 60% 40%',
    '60% 40% 60% 40% / 30% 60% 40% 70%',
]

export function AnimatedProfileImage() {
    const [isHovered, setIsHovered] = useState(false)
    const [blobIdx, setBlobIdx] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setBlobIdx(i => (i + 1) % BLOB_SHAPES.length), 3200)
        return () => clearInterval(id)
    }, [])

    const currentBlob = BLOB_SHAPES[blobIdx]
    const nextBlob = BLOB_SHAPES[(blobIdx + 1) % BLOB_SHAPES.length]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="hidden md:flex justify-center items-center flex-shrink-0"
        >
            <motion.div
                className="relative flex items-center justify-center"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
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
    )
}
