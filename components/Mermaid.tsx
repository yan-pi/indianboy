import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  children: string
}

const Mermaid: React.FC<MermaidProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(typeof window !== 'undefined')
  }, [])

  useEffect(() => {
    if (isClient && ref.current) {
      mermaid.initialize({ startOnLoad: false })
      mermaid.contentLoaded()
      mermaid.render('mermaid-svg', children, ref.current)
    }
  }, [children, isClient])

  return <div ref={ref} className="my-6" />
}

export default Mermaid
