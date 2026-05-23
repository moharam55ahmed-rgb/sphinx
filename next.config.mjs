import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const backUrl = (process.env.NEXT_PUBLIC_BACK_URL || apiUrl.replace(/\/api\/?$/, '')).replace(/\/$/, '')

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
        source: '/uploads/:path*',
        destination: `${backUrl}/uploads/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
