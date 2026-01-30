#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// CONFIGURATION - Matches lib/og/styles.ts
// ============================================
const OG_COLORS = {
  background: '#282828',
  foreground: '#ebdbb2',
  primary: '#b8bb26',
  accent: '#83a598',
  muted: '#a89984',
  card: '#3c3836',
}

const OG_SIZE = { width: 1200, height: 630 }

// ============================================
// HELPER FUNCTIONS
// ============================================

async function loadFonts() {
  console.log('📦 Loading fonts from Google Fonts...')

  // Fetch fonts from Google Fonts API
  // We need to request with a user agent that gets TTF (not WOFF2)
  const fetchFont = async (weight) => {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`

    // Request CSS with a user-agent that gets TTF format
    const cssResponse = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Node.js)',
      },
    })
    const css = await cssResponse.text()

    // Extract the font URL from the CSS (matches url(...) in @font-face)
    const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)/)
    if (!fontUrlMatch) {
      throw new Error(`Could not extract font URL for weight ${weight}`)
    }

    const fontUrl = fontUrlMatch[1]
    console.log(`   Found font URL for weight ${weight}: ${fontUrl.substring(0, 60)}...`)

    const fontResponse = await fetch(fontUrl)
    return fontResponse.arrayBuffer()
  }

  const [interBold, interRegular] = await Promise.all([
    fetchFont(700),
    fetchFont(400),
  ])

  return [
    { name: 'Inter', data: interBold, style: 'normal', weight: 700 },
    { name: 'Inter', data: interRegular, style: 'normal', weight: 400 },
  ]
}

function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

async function renderToImage(element, fonts) {
  const svg = await satori(element, {
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    fonts,
  })

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: OG_SIZE.width,
    },
  })

  const pngData = resvg.render()
  return pngData.asPng()
}

// ============================================
// IMAGE COMPONENTS (Satori JSX format)
// ============================================

function createHomepageOG() {
  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OG_COLORS.background,
        padding: '60px',
      },
      children: [
        // Gradient accent bar
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: `linear-gradient(90deg, ${OG_COLORS.primary} 0%, ${OG_COLORS.accent} 100%)`,
            },
          },
        },
        // Main content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            },
            children: [
              // Name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: 700,
                    color: OG_COLORS.foreground,
                    marginBottom: '16px',
                    fontFamily: 'Inter',
                  },
                  children: 'Yan Fernandes',
                },
              },
              // Alias
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 32,
                    color: OG_COLORS.primary,
                    marginBottom: '32px',
                    fontFamily: 'Inter',
                  },
                  children: 'aka indianboy',
                },
              },
              // Description
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 24,
                    color: OG_COLORS.muted,
                    maxWidth: '800px',
                    fontFamily: 'Inter',
                  },
                  children: 'Software Engineer | Bitcoin | Open Source',
                },
              },
            ],
          },
        },
        // Domain branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '40px',
              fontSize: 28,
              color: OG_COLORS.accent,
              fontFamily: 'Inter',
            },
            children: 'indianboy.sh',
          },
        },
      ],
    },
  }
}

function createBlogPostOG(post) {
  const title = truncateText(post.title || 'Blog Post', 77)
  const description = truncateText(post.description || '', 120)
  const tags = (post.tags || []).slice(0, 3)
  const titleFontSize = title.length > 50 ? 42 : 56

  const middleChildren = [
    // Title
    {
      type: 'div',
      props: {
        style: {
          fontSize: titleFontSize,
          fontWeight: 700,
          color: OG_COLORS.foreground,
          lineHeight: 1.2,
          fontFamily: 'Inter',
          maxWidth: '1000px',
        },
        children: title,
      },
    },
  ]

  // Description (conditional)
  if (description) {
    middleChildren.push({
      type: 'div',
      props: {
        style: {
          fontSize: 24,
          color: OG_COLORS.muted,
          lineHeight: 1.4,
          fontFamily: 'Inter',
          maxWidth: '900px',
        },
        children: description,
      },
    })
  }

  // Tags (conditional)
  if (tags.length > 0) {
    middleChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        },
        children: tags.map((tag) => ({
          type: 'div',
          props: {
            style: {
              backgroundColor: OG_COLORS.card,
              color: OG_COLORS.primary,
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: 16,
              fontFamily: 'Inter',
            },
            children: tag,
          },
        })),
      },
    })
  }

  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: OG_COLORS.background,
        padding: '60px',
      },
      children: [
        // Gradient accent bar
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: `linear-gradient(90deg, ${OG_COLORS.primary} 0%, ${OG_COLORS.accent} 100%)`,
            },
          },
        },
        // Content area
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            },
            children: [
              // Top: Blog indicator
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 20,
                        color: OG_COLORS.accent,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontFamily: 'Inter',
                      },
                      children: 'Blog',
                    },
                  },
                },
              },
              // Middle: Title, description, tags
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  },
                  children: middleChildren,
                },
              },
              // Bottom: Branding
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 24,
                                color: OG_COLORS.foreground,
                                fontFamily: 'Inter',
                                fontWeight: 600,
                              },
                              children: 'Yan Fernandes',
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 20,
                                color: OG_COLORS.muted,
                                fontFamily: 'Inter',
                              },
                              children: '@indianboy',
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 24,
                          color: OG_COLORS.accent,
                          fontFamily: 'Inter',
                        },
                        children: 'indianboy.sh',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🎨 Generating OG images...')

  const outputDir = path.join(__dirname, '..', 'public', 'og')
  const metadataPath = path.join(__dirname, '..', 'lib', 'blog-metadata.json')

  // Check if metadata exists
  if (!fs.existsSync(metadataPath)) {
    console.error(
      '❌ blog-metadata.json not found. Run generate-blog-metadata.mjs first.',
    )
    process.exit(1)
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Load fonts once (reused for all images)
  const fonts = await loadFonts()

  // Generate homepage OG image
  console.log('📸 Generating homepage OG image...')
  const homepageElement = createHomepageOG()
  const homepagePng = await renderToImage(homepageElement, fonts)
  fs.writeFileSync(path.join(outputDir, 'home.png'), homepagePng)
  console.log('   ✓ Generated: public/og/home.png')

  // Load blog metadata
  const blogPosts = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
  console.log(`\n📝 Found ${blogPosts.length} blog posts`)

  // Generate OG image for each blog post
  for (const post of blogPosts) {
    console.log(`📸 Generating OG for: ${post.slug}`)
    try {
      const element = createBlogPostOG(post)
      const png = await renderToImage(element, fonts)
      fs.writeFileSync(path.join(outputDir, `${post.slug}.png`), png)
      console.log(`   ✓ Generated: public/og/${post.slug}.png`)
    } catch (error) {
      console.error(`   ❌ Failed to generate OG for ${post.slug}:`, error.message)
    }
  }

  console.log(`\n✅ Generated ${blogPosts.length + 1} OG images`)
  console.log(`📁 Output directory: ${outputDir}`)
}

main().catch((error) => {
  console.error('❌ Error generating OG images:', error)
  process.exit(1)
})
