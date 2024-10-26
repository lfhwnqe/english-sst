/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    runtime: "edge",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 本地 API 路径
        destination: "https://maomaocong.site/api/:path*", // 代理到远程 API
      },
    ];
  },
};

export default nextConfig;
