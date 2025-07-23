import type { MDXComponents } from 'mdx/types'
import Image from './components/Image'
import Mermaid from './components/Mermaid'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => (
      <figure>
        <img src={src} alt={alt} className="rounded-xl" />
        <figcaption className="text-center">{caption}</figcaption>
      </figure>
    ),
    Mermaid: (props) => {
      // Permite uso tanto <Mermaid chart={...} /> quanto <Mermaid>...</Mermaid>
      const chart = typeof props.chart === 'string' ? props.chart : (props.children as string)
      return <Mermaid chart={chart} />
    },
    code: (props) => {
      // Repasse todas as props, incluindo className
      return <code {...props}>{props.children}</code>;
    },
  }
}
