/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/reports/:path*',
        destination: 'https://dtinterpreting.video*',
      },
    ]
  },
}

export default nextConfig
