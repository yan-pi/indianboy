import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from './types'
import blogMetadata from './blog-metadata.json'

/**
 * Reads all blog posts from pre-generated metadata JSON
 * This avoids filesystem access at runtime, making it compatible with Cloudflare Workers
 * The metadata is generated at build time by scripts/generate-blog-metadata.mjs
 * @returns Promise<BlogPost[]> Array of blog posts with metadata, sorted by publishedAt date (newest first)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // Return pre-generated metadata (already sorted by date)
  return blogMetadata as BlogPost[]
}

/**
 * Gets a single blog post by slug from pre-generated metadata JSON
 * This avoids filesystem access at runtime, making it compatible with Cloudflare Workers
 * @param slug The blog post slug
 * @returns Promise<BlogPost | null> The blog post or null if not found
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = blogMetadata.find((p) => p.slug === slug)
  return post || null
}

/**
 * Generates a unique identifier from the slug
 * @param slug The blog post slug
 * @returns A unique identifier
 */
function generateUID(slug: string): string {
  return `blog-${slug}`
}

/**
 * Generates RSS feed XML for blog posts
 * @param blogPosts Array of blog posts
 * @param siteUrl The base URL of the site
 * @returns RSS feed XML string
 */
export function generateRSSFeed(
  blogPosts: BlogPost[],
  siteUrl: string,
): string {
  const rssItems = blogPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${siteUrl}${post.link}</link>
      <guid>${siteUrl}${post.link}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.author ? `<author>${post.author}</author>` : ''}
      ${post.tags ? post.tags.map((tag) => `<category>${tag}</category>`).join('\n      ') : ''}
    </item>
  `,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yan Fernandes - Blog</title>
    <description>Personal blog posts about design, engineering, and technology</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    ${rssItems}
  </channel>
</rss>`
}

// Get the latest blog posts (default 3)
export async function getLatestBlogPosts(
  limit: number = 3,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.slice(0, limit)
}

// Get all unique tags from all blog posts
export async function getAllTags(): Promise<string[]> {
  const posts = await getBlogPosts()
  const allTags = posts.flatMap((post) => post.tags || [])
  return Array.from(new Set(allTags)).sort()
}

// Filter blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

// Get blog posts with pagination
export async function getBlogPostsPaginated(
  page: number = 1,
  limit: number = 10,
): Promise<{
  posts: BlogPost[]
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}> {
  const allPosts = await getBlogPosts()
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const posts = allPosts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(allPosts.length / limit)

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
