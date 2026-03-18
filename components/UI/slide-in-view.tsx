'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type SlideInViewProps = {
  children: ReactNode
  className?: string
}

export function SlideInView({ children, className }: SlideInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
