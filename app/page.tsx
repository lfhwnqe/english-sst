import Link from "next/link";
import ResponsiveAppBar from "@/app/components/common/appHeader";

export default async function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ResponsiveAppBar></ResponsiveAppBar>
      <div className="max-w-4xl mx-auto p-8">
        {/* 欢迎区域 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">欢迎来到毛毛虫音频</h1>
          <p className="text-gray-400">创建和管理你的音频场景</p>
        </div>

        {/* 用户信息或登录按钮 */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-xl mb-2">欢迎回来</p>
            <p className="text-gray-400 mb-4">开始创建或管理你的音频场景</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/audio-scene/list"
            className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">场景列表</h2>
            <p className="text-gray-400">查看和管理你的所有音频场景</p>
          </Link>

          <Link
            href="/audio-scene/create"
            className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">创建场景</h2>
            <p className="text-gray-400">创建新的音频场景</p>
          </Link>
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>毛毛虫音频 - 让声音更有趣</p>
        </div>
      </div>
    </div>
  );
}
