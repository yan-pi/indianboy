#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '..', 'app', 'blog', 'posts')
const outputPath = path.join(__dirname, '..', 'lib', 'blog-metadata.json')

console.log('📝 Generating blog metadata...')
console.log('Blog directory:', blogDir)

try {
  const files = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.mdx'))
    .map((dirent) => dirent.name)

  const blogPosts = []

  for (const file of files) {
    const mdxPath = path.join(blogDir, file)

    try {
      const fileContent = fs.readFileSync(mdxPath, 'utf-8')
      const { data: frontmatter, content } = matter(fileContent)
      const slug = file.replace(/\.mdx$/, '')

      if (!frontmatter.title || !frontmatter.publishedAt) {
        console.warn(
          `⚠️  Skipping ${file}: missing required frontmatter (title, publishedAt)`,
        )
        continue
      }

      // Calculate reading time
      const wordCount = content.trim().split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      blogPosts.push({
        title: frontmatter.title,
        description:
          frontmatter.description || frontmatter.summary || 'Blog post',
        summary: frontmatter.summary || frontmatter.description,
        link: `/blog/${slug}`,
        uid: `blog-${slug}`,
        slug,
        publishedAt: frontmatter.publishedAt,
        tags: frontmatter.tags || [],
        author: frontmatter.author,
        image: frontmatter.image,
        readingTime: `${readingTime} min read`,
        content: content.trim(), // Bundle raw MDX content for runtime compilation
      })

      console.log(`✓ Processed: ${file}`)
    } catch (error) {
      console.warn(`⚠️  Failed to process ${file}:`, error.message)
    }
  }

  // Sort by date (newest first)
  blogPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2), 'utf-8')

  console.log(`\n✅ Generated metadata for ${blogPosts.length} blog posts`)
  console.log(`📄 Output: ${outputPath}`)
} catch (error) {
  console.error('❌ Error generating blog metadata:', error)
  process.exit(1)
}
