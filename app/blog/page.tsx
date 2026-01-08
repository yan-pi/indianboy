import { BlogListClient } from '@/components/blog/blog-list-client'
import { getBlogPosts, getAllTags } from '@/lib/blog'

// Force static generation at build time to avoid runtime filesystem access in Cloudflare Workers
export const dynamic = 'force-static'
export const revalidate = false

export default async function BlogListPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()])

  return <BlogListClient initialPosts={posts} tags={tags} />
}
