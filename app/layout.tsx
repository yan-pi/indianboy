import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { CustomThemeProvider } from '@/providers/theme-provider'
import Script from 'next/script'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://indianboy.sh/'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Yan - indianboy.sh',
    template: '%s | indianboy.sh',
  },
  description:
    'Yan is a personal blog by IndianBoy, sharing insights on technology, programming, and life experiences.',
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://umami-production-437f.up.railway.app/script.js"
          data-website-id="16b5a86e-df78-4785-ba32-f08cbc8c9a7d"
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-[color:var(--color-background)] tracking-tight antialiased`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <CustomThemeProvider>
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
              <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
                <Header />
                {children}
                <Footer />
              </div>
            </div>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
