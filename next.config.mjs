/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/audio/:path*",
        destination: "https://nuo-english.s3.us-east-2.amazonaws.com/:path*",
      },

      // {
      //   source: "/api/:path*", // 本地 API 路径
      //   destination: "https://maomaocong.site/api/:path*", // 代理到远程 API
      // },
    ];
  },
};

export default nextConfig;
