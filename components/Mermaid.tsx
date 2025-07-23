'use client'
import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Initialize Mermaid only once
if (typeof window !== 'undefined' && !(window as any).__mermaid_initialized) {
  console.log('[Mermaid] Initializing Mermaid.js')
  mermaid.initialize({ startOnLoad: false, theme: 'default' })
  ;(window as any).__mermaid_initialized = true
}

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    console.log('[Mermaid] useEffect triggered', { chart })
    setError(null)
    setSvg('')
    if (!chart) {
      console.log('[Mermaid] No chart provided')
      return
    }
    // Generate a unique id for each diagram
    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9)
    console.log('[Mermaid] Rendering diagram', { id, chart })
    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled) {
          console.log('[Mermaid] Rendered successfully', { id })
          setSvg(svg)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Mermaid] Render error', err)
          setError('Mermaid syntax error')
        }
      })
    return () => {
      cancelled = true
      console.log('[Mermaid] Cleanup effect', { id })
    }
  }, [chart])

  useEffect(() => {
    console.log('[Mermaid] svg state updated', { svg, error })
  }, [svg, error])

  return (
    <div className="mermaid" ref={ref}>
      {error ? (
        <div style={{ color: 'red', fontSize: '0.95em' }}>{error}</div>
      ) : svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div style={{ color: '#888', fontSize: '0.95em' }}>Rendering...</div>
      )}
    </div>
  )
}
