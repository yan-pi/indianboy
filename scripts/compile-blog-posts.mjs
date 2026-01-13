#!/usr/bin/env node
import { compile } from '@mdx-js/mdx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus/all'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '..', 'app', 'blog', 'posts')
const outputDir = path.join(__dirname, '..', 'lib', 'compiled-posts')

console.log('🔨 Compiling blog posts to JavaScript...')
console.log('Blog directory:', blogDir)
console.log('Output directory:', outputDir)

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

try {
  // Read all MDX files
  const files = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.mdx'))
    .map((dirent) => dirent.name)

  console.log(`\nFound ${files.length} MDX files to compile\n`)

  const compiledPosts = []
  const failedCompilations = []

  for (const file of files) {
    const mdxPath = path.join(blogDir, file)
    const slug = file.replace(/\.mdx$/, '')

    try {
      console.log(`📄 Compiling: ${file}`)

      // Read and parse MDX file
      const fileContent = fs.readFileSync(mdxPath, 'utf-8')
      const { content } = matter(fileContent)

      // Compile MDX to JavaScript
      const compiled = await compile(content, {
        outputFormat: 'program',
        development: false,
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex, rehypePrism],
      })

      // Convert VFile to string - this is now a complete ES module
      const moduleCode = String(compiled)

      // Write compiled JavaScript to output directory
      const outputPath = path.join(outputDir, `${slug}.js`)
      fs.writeFileSync(outputPath, moduleCode, 'utf-8')

      compiledPosts.push({ slug, file, outputPath })
      console.log(
        `   ✓ Compiled to: ${path.relative(process.cwd(), outputPath)}`,
      )
    } catch (error) {
      console.error(`\n❌ Failed to compile ${file}`)
      console.error(`Error: ${error.message}`)
      if (error.message.includes('Unexpected character')) {
        console.error(
          `\n💡 Tip: This often happens with LaTeX \\text{} commands.`,
        )
        console.error(
          `   Try using \\mathrm{} instead, or use code blocks for formulas.`,
        )
      }
      console.error(`File: ${mdxPath}\n`)
      failedCompilations.push({ file, error: error.message })
    }
  }

  // Create index file that exports all compiled posts
  const indexContent = compiledPosts
    .map(({ slug }) => {
      // Convert slug to valid JS identifier: prefix with 'post_' and replace hyphens
      const identifier = 'post_' + slug.replace(/-/g, '_')
      return `export { default as ${identifier} } from './${slug}.js'`
    })
    .join('\n')

  const indexPath = path.join(outputDir, 'index.js')
  fs.writeFileSync(indexPath, indexContent + '\n', 'utf-8')

  console.log(`\n✅ Successfully compiled ${compiledPosts.length} blog posts`)
  console.log(
    `📦 Created index file: ${path.relative(process.cwd(), indexPath)}`,
  )

  // Check for failed compilations and exit with error if any
  if (failedCompilations.length > 0) {
    console.error(
      `\n⚠️  ${failedCompilations.length} file(s) failed to compile:`,
    )
    failedCompilations.forEach(({ file }) => {
      console.error(`   - ${file}`)
    })
    console.error('\n❌ Build cannot continue with compilation errors.')
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Error compiling blog posts:', error)
  process.exit(1)
}
