import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const upstreamApi =
  process.env.API_UPSTREAM_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
const upstreamOrigin = upstreamApi.replace(/\/api\/?$/, '').replace(/\/$/, '')
const backUrl = (process.env.NEXT_PUBLIC_BACK_URL || upstreamOrigin).replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: backUrl.startsWith('https') ? 'https' : 'http',
        hostname: new URL(backUrl).hostname,
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${upstreamOrigin}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backUrl}/uploads/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
