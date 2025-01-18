// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   runtimeCaching: require("./workbox-config.js"),
//   disable: process.env.NODE_ENV === "development",
// });
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const isProduction = process.env.NODE_ENV === "production";
console.log("🌹isProduction", isProduction);
console.log("🌹isProduction:", isProduction);
const path = require("path");
const withPWA = isProduction
  ? require("@ducanh2912/next-pwa").default({
      dest: "public",
    })
  : (config) => config;
/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  alias: {
    "@": path.resolve(__dirname, "app"),
    "@/app": path.resolve(__dirname, "app"),
    "@/components": path.resolve(__dirname, "app/components"),
    "@/stores": path.resolve(__dirname, "app/stores"),
    "@/utils": path.resolve(__dirname, "utils"),
  },
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
module.exports = withNextIntl(nextConfig);


// module.exports = nextConfig;
