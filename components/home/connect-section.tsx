'use client'
import { motion } from 'motion/react'
import { MagneticSocialLink } from './magnetic-social-link'
import { ConnectSectionProps } from '@/lib/types'

export function ConnectSection({
  email,
  socialLinks,
  variants,
  transition,
  className,
}: ConnectSectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <h3 className="theme-text-foreground mb-5 text-lg font-medium">
        Connect
      </h3>
      <p className="theme-text-muted mb-5">
        Feel free to contact me at{' '}
        <a
          className="text-[color:var(--color-foreground)] underline"
          href={`mailto:${email}`}
        >
          {email}
        </a>
      </p>
      <div className="flex items-center justify-start space-x-3">
        {socialLinks.map((link) => (
          <MagneticSocialLink key={link.label} link={link.link}>
            {link.label}
          </MagneticSocialLink>
        ))}
      </div>
    </motion.section>
  )
}
