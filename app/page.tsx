import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getUserInfo() {
  const headersList = headers();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-info`, {
      headers: {
        cookie: headersList.get('cookie') || '',
      },
      credentials: 'include',
    });
    
    if (response.status === 401) {
      console.log('User is not authenticated');
      return null;
    }
    
    if (!response.ok) {
      console.error('Failed to fetch user info:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}

export default async function Home() {
  const user = await getUserInfo();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* 欢迎区域 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">欢迎来到毛毛虫音频</h1>
          <p className="text-gray-400">创建和管理你的音频场景</p>
        </div>

        {/* 用户信息或登录按钮 */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          {user ? (
            <div className="text-center">
              <p className="text-xl mb-2">欢迎回来, {user.email}</p>
              <p className="text-gray-400 mb-4">开始创建或管理你的音频场景</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-4">登录以开始使用</p>
              <Link 
                href="/login"
                className="inline-block px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            </div>
          )}
        </div>

        {/* 功能导航区 - 只对登录用户显示 */}
        {user && (
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
        )}

        {/* 其他信息 */}
        <div className="mt-12 text-center text-gray-400">
          <p>毛毛虫音频 - 让声音更有趣</p>
        </div>
      </div>
    </div>
  );
}
