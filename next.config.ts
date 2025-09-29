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
    qualities: [95],
  },
};

export default nextConfig;
