'use client'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { Magnetic } from '@/components/ui/magnetic'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import {
  VARIANTS_SECTION,
  TRANSITION_SECTION,
} from '@/components/home/animations'

function CopyButton() {
  const [text, setText] = useState('Copy')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setText('Copied')

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setText('Copy'), 2000)
    } catch {
      setText('Failed')
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy current page URL"
      className="font-base flex items-center gap-1 text-center text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-accent)]"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's internal navigation history
    const hasInternalHistory =
      typeof window !== 'undefined' &&
      document.referrer &&
      document.referrer.includes(window.location.origin)

    if (hasInternalHistory) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-accent)]"
      type="button"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </button>
  )
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isBlogPost = pathname?.startsWith('/blog/') && pathname !== '/blog'

  return (
    <>
      {/* Header Blur Overlay */}
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-[var(--color-card)] backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* Scroll Progress Bar */}
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-[var(--color-border)]"
        springOptions={{ bounce: 0 }}
      />

      {/* Blog Post Header - Back Arrow + Copy URL */}
      {isBlogPost && (
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial="hidden"
          animate="visible"
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <Magnetic intensity={0.3} range={50}>
            <BackButton />
          </Magnetic>
          <Magnetic intensity={0.3} range={50}>
            <CopyButton />
          </Magnetic>
        </motion.div>
      )}

      {/* Blog Content */}
      <main className="prose prose-h1:text-2xl prose-h1:font-semibold prose-h2:text-xl prose-h3:text-lg prose-strong:font-medium prose-headings:text-[var(--color-foreground)] prose-p:text-[var(--color-foreground)] prose-code:text-[var(--color-accent)] prose-code:bg-[var(--color-muted)] prose-pre:bg-[var(--color-card)] prose-pre:border prose-pre:border-[var(--color-border)] max-w-none pb-20 [&_a]:!text-[var(--color-primary)] [&_a]:!no-underline [&_a]:!transition-colors [&_a]:!duration-200 [&_a:hover]:!text-[var(--color-accent)]">
        {children}
      </main>
    </>
  )
}
