'use client'
import { motion } from 'motion/react'
import { SectionProps } from '@/lib/types'

export function IntroSection({
  variants,
  transition,
  className,
}: SectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <div className="flex-1">
        <p className="theme-text-muted">
          Software Engineer with an unhealthy obsession for Linux and Neovim.
          Former Techlead at FESF/SUS, now technical staff at Sats Capital while
          crafting open-source projects in my spare time
        </p>
      </div>
    </motion.section>
  )
}
