import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import { useMDXComponents } from '@/mdx-components'
import { BlogComments } from '@/components/blog/blog-comments'

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
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://indianboy.sh/blog/${slug}`,
      siteName: 'indianboy.sh',
      publishedTime: post.publishedAt,
      authors: [post.author || 'Yan Fernandes'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  // Dynamically import the pre-compiled MDX module
  // This avoids runtime eval() which is blocked in Cloudflare Workers
  const CompiledMDX = await import(`@/lib/compiled-posts/${slug}.js`).then(
    (mod) => mod.default,
  )

  return (
    <article className="max-w-none">
      <header className="mb-8 space-y-4">
        <h1 className="theme-text-foreground text-3xl font-bold">
          {post.title}
        </h1>
      </header>

      <CompiledMDX components={useMDXComponents({})} />

      <BlogComments slug={slug} />
    </article>
  )
}
