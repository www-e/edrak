import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'slelguoygbfzlpylpxfs.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'edraak-marketing-uploads.edraak.org',
        port: '',
        pathname: '/**',
      },
      // Consolidate edraak domains with wildcard
      {
        protocol: 'https',
        hostname: '**.edraak.org',
        port: '',
        pathname: '/**',
      },
      // Fix for google-play-badge image
      {
        protocol: 'https',
        hostname: 'www.edraak.org',
        port: '',
        pathname: '/static/images/**',
      },
      {
        protocol: 'https',
        hostname: 'edrak-courses-cdn.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations for Next.js 15
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Standalone output for Vercel deployment
  output: 'standalone',

  // Enhanced caching headers for performance
  async headers() {
    return [
      {
        source: '/courses/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/api/courses/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=3600'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
