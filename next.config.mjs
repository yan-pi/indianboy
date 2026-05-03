import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
})

const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Cloudflare uses a different build process via OpenNext
  // No need for 'output: standalone'
  async redirects() {
    return [
      {
        source: '/blog/coding-confortable',
        destination: '/blog/coding-comfortable',
        permanent: true,
      },
      {
        source: '/blog/use-semmantic-release',
        destination: '/blog/use-semantic-release',
        permanent: true,
      },
    ]
  },
})

export default nextConfig
