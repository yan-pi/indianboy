import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog'
import {
  OG_COLORS,
  OG_SIZE,
  INTER_BOLD_URL,
  INTER_REGULAR_URL,
} from '@/lib/og/styles'

export const runtime = 'edge'
export const alt = 'Blog Post - indianboy.sh'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  const title = post?.title || 'Blog Post'
  const description = post?.description || ''
  const tags = post?.tags || []

  const interBold = fetch(new URL(INTER_BOLD_URL)).then((res) =>
    res.arrayBuffer(),
  )
  const interRegular = fetch(new URL(INTER_REGULAR_URL)).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: OG_COLORS.background,
          padding: '60px',
        }}
      >
        {/* Gradient accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: `linear-gradient(90deg, ${OG_COLORS.primary} 0%, ${OG_COLORS.accent} 100%)`,
          }}
        />

        {/* Content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Top: Blog indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: OG_COLORS.accent,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontFamily: 'Inter',
              }}
            >
              Blog
            </div>
          </div>

          {/* Middle: Title and description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: title.length > 50 ? 42 : 56,
                fontWeight: 700,
                color: OG_COLORS.foreground,
                lineHeight: 1.2,
                fontFamily: 'Inter',
                maxWidth: '1000px',
              }}
            >
              {title.length > 80 ? title.substring(0, 77) + '...' : title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 24,
                  color: OG_COLORS.muted,
                  lineHeight: 1.4,
                  fontFamily: 'Inter',
                  maxWidth: '900px',
                }}
              >
                {description.length > 120
                  ? description.substring(0, 117) + '...'
                  : description}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      backgroundColor: OG_COLORS.card,
                      color: OG_COLORS.primary,
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: 16,
                      fontFamily: 'Inter',
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom: Branding */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: OG_COLORS.foreground,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                }}
              >
                Yan Fernandes
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: OG_COLORS.muted,
                  fontFamily: 'Inter',
                }}
              >
                @indianboy
              </div>
            </div>

            <div
              style={{
                fontSize: 24,
                color: OG_COLORS.accent,
                fontFamily: 'Inter',
              }}
            >
              indianboy.sh
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: await interRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
