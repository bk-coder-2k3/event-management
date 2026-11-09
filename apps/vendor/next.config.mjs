/** @type {import('next').NextConfig} */
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vizhaspace/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/vendor/:path*',
        destination: '/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_INTERNAL_URL}/api/v1/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_INTERNAL_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

