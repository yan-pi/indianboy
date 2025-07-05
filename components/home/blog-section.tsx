'use client'
import { motion } from 'motion/react'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BlogSectionProps } from '@/lib/types'

export function BlogSection({ blogPosts, variants, transition, className }: BlogSectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium theme-text-foreground">Blog</h3>
        <Link 
          href="/blog"
          className="text-sm theme-text-muted hover:theme-text-foreground transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="flex flex-col space-y-0">
        <AnimatedBackground
          enableHover
          className="h-full w-full theme-border-radius theme-bg-muted"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {blogPosts.map((post) => (
            <Link
              key={post.uid}
              className="-mx-3 theme-border-radius-xl px-3 py-3"
              href={post.link}
              data-id={post.uid}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal theme-text-foreground">
                  {post.title}
                </h4>
                <p className="theme-text-muted">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </motion.section>
  )
}

