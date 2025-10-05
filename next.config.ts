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
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Reduce memory usage in development
    output: 'standalone',
  }),
};

export default nextConfig;
