const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: require('./workbox-config.js')
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  async rewrites() {
    return [{
      source: "/audio/:path*",
      destination: "https://nuo-english.s3.us-east-2.amazonaws.com/:path*"
    }];
  }
});

module.exports = nextConfig;