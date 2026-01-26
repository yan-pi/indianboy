import { ImageResponse } from 'next/og'
import {
  OG_COLORS,
  OG_SIZE,
  INTER_BOLD_URL,
  INTER_REGULAR_URL,
} from '@/lib/og/styles'

export const runtime = 'edge'
export const alt = 'Yan Fernandes - indianboy.sh'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
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
          alignItems: 'center',
          justifyContent: 'center',
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

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: OG_COLORS.foreground,
              marginBottom: '16px',
              fontFamily: 'Inter',
            }}
          >
            Yan Fernandes
          </div>

          {/* Alias */}
          <div
            style={{
              fontSize: 32,
              color: OG_COLORS.primary,
              marginBottom: '32px',
              fontFamily: 'Inter',
            }}
          >
            aka indianboy
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: OG_COLORS.muted,
              maxWidth: '800px',
              fontFamily: 'Inter',
            }}
          >
            Software Engineer | Bitcoin | Open Source
          </div>
        </div>

        {/* Domain branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 28,
            color: OG_COLORS.accent,
            fontFamily: 'Inter',
          }}
        >
          indianboy.sh
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
