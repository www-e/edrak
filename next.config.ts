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
};

export default nextConfig;
