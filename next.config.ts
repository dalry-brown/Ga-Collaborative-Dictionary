// next.config.ts - Fixed for Next.js 15

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  // Fixed: serverComponentsExternalPackages moved to root level
  serverExternalPackages: ['bcryptjs'],
}

export default nextConfig