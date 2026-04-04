'use client'
import { motion } from 'motion/react'
import { SectionProps } from '@/lib/types'
import Link from 'next/link'

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
          Software Engineer with an unhealthy obsession for Linux and Neovim. <br />
          Former Techlead at FESF/SUS, and Sats Capital. <br />
          {/* Now <Link className="text-(--color-primary)! underline" href="https://vinteum.org">Vinteum</ Link> Fellow contributing to open-source bitcoin projects fulltime.  */}

          Now contributing to open-source bitcoin projects fulltime. 
        </p>
      </div>
    </motion.section>
  )
}
