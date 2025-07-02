import fs from 'fs'
import path from 'path'
import { BlogPost } from './types'

/**
 * Reads all blog posts from the app/blog directory and extracts their metadata
 * This function can only be used on the server side (build time or server components)
 * @returns Promise<BlogPost[]> Array of blog posts with metadata
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  
  try {
    // Read all directories in the blog folder
    const directories = fs.readdirSync(blogDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    const blogPosts: BlogPost[] = []
    
    for (const dir of directories) {
      const mdxPath = path.join(blogDir, dir, 'page.mdx')
      
      // Check if the page.mdx file exists
      if (fs.existsSync(mdxPath)) {
        try {
          // Read the MDX file content
          const content = fs.readFileSync(mdxPath, 'utf-8')
          
          // Extract metadata from the file
          const metadata = extractMetadataFromMDX(content)
          
          if (metadata) {
            blogPosts.push({
              title: metadata.title,
              description: metadata.description,
              link: `/blog/${dir}`,
              uid: generateUID(dir)
            })
          }
        } catch (error) {
          console.warn(`Failed to process blog post: ${dir}`, error)
        }
      }
    }
    
    return blogPosts
  } catch (error) {
    console.error('Failed to read blog directory:', error)
    return []
  }
}

/**
 * Extracts metadata from MDX file content
 * @param content The raw MDX file content
 * @returns Extracted metadata or null if not found
 */
function extractMetadataFromMDX(content: string): { title: string; description: string } | null {
  try {
    // Look for the metadata export in the file
    const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})\s*;?/m)
    
    if (metadataMatch) {
      // Extract the metadata object string
      const metadataStr = metadataMatch[1]
      
      // Use a safer approach to extract title and description
      const titleMatch = metadataStr.match(/title\s*:\s*['"`]([^'"`]*?)['"`]/)
      const descriptionMatch = metadataStr.match(/description\s*:\s*['"`]([\s\S]*?)['"`]/)
      
      if (titleMatch && descriptionMatch) {
        return {
          title: titleMatch[1].trim(),
          description: descriptionMatch[1].trim()
        }
      }
    }
    
    // Fallback: try to extract title from the first h1 heading
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return {
        title: h1Match[1].trim(),
        description: 'Blog post' // Fallback description
      }
    }
    
    return null
  } catch (error) {
    console.warn('Failed to extract metadata:', error)
    return null
  }
}

/**
 * Generates a unique identifier from the directory name
 * @param dirName The directory name
 * @returns A unique identifier
 */
function generateUID(dirName: string): string {
  // Convert directory name to a more readable UID
  return `blog-${dirName}`
}

