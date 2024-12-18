'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-400 rounded-full border-t-transparent animate-spin dark:border-gray-500"></div>
        <p className="text-gray-300 text-lg font-medium">加载中...</p>
      </div>
    </div>
  );
} 