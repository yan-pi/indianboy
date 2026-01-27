'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  // Hide header on individual blog post pages
  if (pathname?.startsWith('/blog/') && pathname !== '/blog') {
    return null
  }

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <div className="mb-1 flex items-center space-x-2">
          <Link href="/" className="theme-text-foreground text-xl font-medium">
            Yan Fernandes
          </Link>

          <span className="hidden font-serif text-lg text-[var(--color-muted-foreground)] italic sm:inline">
            aka indianboy
          </span>
        </div>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="tect-lg text-[var(--color-muted-foreground)]"
          delay={0.5}
        >
          Tech guy
        </TextEffect>
      </div>
    </header>
  )
}
