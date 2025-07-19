'use client';
import { TextMorph } from '@/components/ui/text-morph';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { useEffect, useRef, useState } from 'react';

function CopyButton() {
  const [text, setText] = useState('Copy');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setText('Copied');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setText('Copy'), 2000);
    } catch {
      setText('Failed');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy current page URL"
      className="font-base flex items-center gap-1 text-center text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)] transition-colors"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  );
}

export default function LayoutBlogPost({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header Blur Overlay */}
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-[var(--color-card)] backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* Scroll Progress Bar */}
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-[var(--color-border)]"
        springOptions={{ bounce: 0 }}
      />

      {/* Copy URL Button */}
      <div className="absolute top-24 right-4">
        <CopyButton />
      </div>

      {/* Blog Content */}
      <main
        className="prose prose-h1:text-2xl prose-h1:font-semibold prose-h2:text-xl prose-h3:text-lg prose-strong:font-medium prose-headings:text-[var(--color-foreground)] prose-p:text-[var(--color-foreground)] prose-code:text-[var(--color-accent)] prose-code:bg-[var(--color-muted)] prose-pre:bg-[var(--color-card)] prose-pre:border prose-pre:border-[var(--color-border)] max-w-none pb-20 [&_a]:!text-[var(--color-primary)] [&_a]:!no-underline [&_a]:!transition-colors [&_a]:!duration-200 [&_a:hover]:!text-[var(--color-accent)]"
      >
        {children}
      </main>
    </>
  );
}
