'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <div className="mb-1 flex items-center space-x-2">
          <Link href="/" className="theme-text-foreground font-medium">
            Yan Fernandes
          </Link>

          <span className="font-serif text-xl text-[var(--color-muted-foreground)] italic">
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
          Staff Engineer
        </TextEffect>
      </div>
    </header>
  )
}
