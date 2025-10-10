import { getBlogPosts, generateRSSFeed } from '@/lib/blog'

export async function GET() {
  const posts = await getBlogPosts()
  const siteUrl = process.env.SITE_URL || 'https://indianboy.sh'

  const rss = generateRSSFeed(posts, siteUrl)

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
