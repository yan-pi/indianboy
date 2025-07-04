import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Read the MDX file content to render
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
        <div className="theme-text-muted flex items-center gap-4 text-sm">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <>
              <span>•</span>
              <span>{post.readingTime}</span>
            </>
          )}
          {/* {post.author && ( */}
          {/*   <> */}
          {/*     <span>•</span> */}
          {/*     <span>by {post.author}</span> */}
          {/*   </> */}
          {/* )} */}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="theme-bg-muted theme-text-muted theme-border-radius px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={content} />
      </div>
    </article>
  )
}
