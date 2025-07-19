import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

// Import plugins
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
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

  const blogDir = path.join(process.cwd(), 'app', 'blog')
  const mdxPath = path.join(blogDir, `${slug}.mdx`)
  const fileContent = fs.readFileSync(mdxPath, 'utf-8')
  const { content } = matter(fileContent)

  return (
    <article className="max-w-none">
      <header className="mb-8 space-y-4">
        <h1 className="theme-text-foreground text-3xl font-bold">
          {post.title}
        </h1>
      </header>

      <MDXRemote
        source={content}
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
