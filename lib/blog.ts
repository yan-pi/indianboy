import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from './types'

/**
 * Reads all blog posts from the app/blog directory and extracts their frontmatter metadata
 * This function can only be used on the server side (build time or server components)
 * @returns Promise<BlogPost[]> Array of blog posts with metadata, sorted by publishedAt date (newest first)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  
  try {
    // Read all .mdx files in the blog directory
    const files = fs.readdirSync(blogDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.mdx'))
      .map(dirent => dirent.name)
    
    const blogPosts: BlogPost[] = []
    
    for (const file of files) {
      const mdxPath = path.join(blogDir, file)
      
      try {
        // Read the MDX file content
        const fileContent = fs.readFileSync(mdxPath, 'utf-8')
        
        // Parse frontmatter using gray-matter
        const { data: frontmatter, content } = matter(fileContent)
        
        // Extract slug from filename (remove .mdx extension)
        const slug = file.replace(/\.mdx$/, '')
        
        // Validate required frontmatter fields
        if (!frontmatter.title || !frontmatter.publishedAt) {
          console.warn(`Blog post ${file} is missing required frontmatter fields (title, publishedAt)`)
          continue
        }
        
        // Calculate reading time (rough estimate: 200 words per minute)
        const wordCount = content.trim().split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)
        
        blogPosts.push({
          title: frontmatter.title,
          description: frontmatter.description || frontmatter.summary || 'Blog post',
          summary: frontmatter.summary || frontmatter.description,
          link: `/blog/${slug}`,
          uid: generateUID(slug),
          slug,
          publishedAt: frontmatter.publishedAt,
          tags: frontmatter.tags || [],
          author: frontmatter.author,
          image: frontmatter.image,
          readingTime: `${readingTime} min read`
        })
      } catch (error) {
        console.warn(`Failed to process blog post: ${file}`, error)
      }
    }
    
    // Sort posts by publishedAt date (newest first)
    return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Failed to read blog directory:', error)
    return []
  }
}

/**
 * Gets a single blog post by slug
 * @param slug The blog post slug
 * @returns Promise<BlogPost | null> The blog post or null if not found
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  const mdxPath = path.join(blogDir, `${slug}.mdx`)
  
  try {
    if (!fs.existsSync(mdxPath)) {
      return null
    }
    
    const fileContent = fs.readFileSync(mdxPath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)
    
    if (!frontmatter.title || !frontmatter.publishedAt) {
      return null
    }
    
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    
    return {
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.summary || 'Blog post',
      summary: frontmatter.summary || frontmatter.description,
      link: `/blog/${slug}`,
      uid: generateUID(slug),
      slug,
      publishedAt: frontmatter.publishedAt,
      tags: frontmatter.tags || [],
      author: frontmatter.author,
      image: frontmatter.image,
      readingTime: `${readingTime} min read`
    }
  } catch (error) {
    console.error(`Failed to read blog post: ${slug}`, error)
    return null
  }
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
export function generateRSSFeed(blogPosts: BlogPost[], siteUrl: string): string {
  const rssItems = blogPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${siteUrl}${post.link}</link>
      <guid>${siteUrl}${post.link}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.author ? `<author>${post.author}</author>` : ''}
      ${post.tags ? post.tags.map(tag => `<category>${tag}</category>`).join('\n      ') : ''}
    </item>
  `).join('')
  
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
export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.slice(0, limit)
}

// Get all unique tags from all blog posts
export async function getAllTags(): Promise<string[]> {
  const posts = await getBlogPosts()
  const allTags = posts.flatMap(post => post.tags || [])
  return Array.from(new Set(allTags)).sort()
}

// Filter blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter(post => post.tags?.includes(tag))
}

// Get blog posts with pagination
export async function getBlogPostsPaginated(page: number = 1, limit: number = 10): Promise<{
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
    hasPrev: page > 1
  }
}

