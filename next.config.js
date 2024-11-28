const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: require("./workbox-config.js"),
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  async rewrites() {
    return [
      {
        source: "/audio/:file*",
        destination: `https://nuo-english.s3.us-east-2.amazonaws.com/:file*`,
        has: [
          {
            type: "header",
            key: "range",
            value: "(.*)",
          },
        ],
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/audio/:path*",
        headers: [
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
    ];
  },
});

module.exports = nextConfig;
