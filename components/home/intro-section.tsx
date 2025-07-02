'use client'
import { motion } from 'motion/react'
import { SectionProps } from '@/lib/types'

export function IntroSection({ variants, transition, className }: SectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <div className="flex-1">
        <p className="theme-text-muted">
          Focused on creating intuitive and performant web experiences.
          Bridging the gap between design and development.
        </p>
      </div>
    </motion.section>
  )
}

