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
      {
        protocol: 'https',
        hostname: 'www.edraak.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.edraak.org',
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

  // Enable Turbopack optimizations
  turbopack: {
    // Enable faster middleware compilation
    resolveAlias: {},
  },

  // Performance optimizations for Next.js 15
  compiler: {
    removeConsole: true, // Always remove console logs in production builds
  },

  // Production optimizations
  output: 'standalone',
};

export default nextConfig;
