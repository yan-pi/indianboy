import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'

// Import plugins
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus/all'
import { useMDXComponents } from '@/mdx-components'
// import rehypeMermaid from 'rehype-mermaid'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  // Content is already bundled in the post object from JSON metadata
  // No filesystem access needed - compatible with Cloudflare Workers
  return (
    <article className="max-w-none">
      <header className="mb-8 space-y-4">
        <h1 className="theme-text-foreground text-3xl font-bold">
          {post.title}
        </h1>
      </header>

      <MDXRemote
        source={post.content || ''}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypePrism], // sem rehypeMermaid aqui
          },
        }}
        components={useMDXComponents({})} // passe seus componentes personalizados
      />
    </article>
  )
}
