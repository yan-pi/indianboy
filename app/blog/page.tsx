import { getBlogPosts, getAllTags } from '@/lib/blog'
import { BlogListClient } from '@/components/blog/blog-list-client'

export default async function BlogListPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()])

  return <BlogListClient initialPosts={posts} tags={tags} />
}
