import { BlogListClient } from '@/components/blog/blog-list-client'
import { getBlogPosts, getAllTags } from '@/lib/blog'

export default async function BlogListPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()])

  return <BlogListClient initialPosts={posts} tags={tags} />
}
