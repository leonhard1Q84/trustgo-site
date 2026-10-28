import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => ({
  // Keep build output separate from the running development server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  reactStrictMode: true,
  // Language routes own their document; unmatched URLs need an independent 404 document.
  experimental: { globalNotFound: true },
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
});

export default nextConfig;
