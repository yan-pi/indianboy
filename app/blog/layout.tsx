'use client'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { useEffect, useState } from 'react'

function CopyButton() {
  const [text, setText] = useState('Copy')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    setTimeout(() => {
      setText('Copy')
    }, 2000)
  }, [text])

  return (
    <button
      onClick={() => {
        setText('Copied')
        navigator.clipboard.writeText(currentUrl)
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-[var(--color-muted-foreground)] transition-colors"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-[var(--color-card)] to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-[var(--color-border)]"
        springOptions={{
          bounce: 0,
        }}
      />

      <div className="absolute top-24 right-4">
        <CopyButton />
      </div>
      <main className="prose prose-h4:prose-base prose-h1:text-xl prose-h1:font-medium prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium prose-headings:text-[var(--color-foreground)] prose-p:text-[var(--color-foreground)] prose-li:text-[var(--color-foreground)] prose-strong:text-[var(--color-foreground)] prose-em:text-[var(--color-muted-foreground)] prose-blockquote:text-[var(--color-muted-foreground)] prose-blockquote:border-[var(--color-border)] prose-code:text-[var(--color-accent)] prose-code:bg-[var(--color-muted)] prose-pre:bg-[var(--color-card)] prose-pre:border prose-pre:border-[var(--color-border)] max-w-none pb-20 [&_a]:!text-[var(--color-primary)] [&_a]:!no-underline [&_a]:!transition-colors [&_a]:!duration-200 [&_a:hover]:!text-[var(--color-accent)]">
        {children}
      </main>
    </>
  )
}
