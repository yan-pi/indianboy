'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'
import { GISCUS_CONFIG } from '@/lib/constants'

interface BlogCommentsProps {
  slug: string
}

export function BlogComments({ slug }: BlogCommentsProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mt-16 min-h-[300px] animate-pulse rounded-lg bg-[var(--color-muted)]" />
    )
  }

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-8">
      <h2 className="mb-6 text-xl font-semibold text-[var(--color-foreground)]">
        Comments
      </h2>
      <Giscus
        id="comments"
        {...GISCUS_CONFIG}
        theme={resolvedTheme === 'dark' ? 'gruvbox_dark' : 'gruvbox_light'}
        loading="lazy"
      />
    </section>
  )
}
