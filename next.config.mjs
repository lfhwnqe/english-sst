import withPWA from 'next-pwa';
import runtimeCaching from './public/workbox-config.js';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development',
  runtimeCaching
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...pwaConfig,
  async rewrites() {
    return [{
      source: "/audio/:path*",
      destination: "https://nuo-english.s3.us-east-2.amazonaws.com/:path*"
    }];
  }
};

export default nextConfig;