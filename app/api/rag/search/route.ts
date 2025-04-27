import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';
import { fetchStreamResponse } from '@/utils/stream-utils';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 检查是否需要流式响应
    const url = new URL(request.url);
    const isStream = url.searchParams.get('stream') === 'true';
    
    if (isStream) {
      // 使用流式响应处理
      return fetchStreamResponse(`${process.env.NEXT_PUBLIC_API_URL}/rag/search`, data, {
        method: 'POST'
      });
    } else {
      // 使用普通API请求
      return apiRequest('/rag/search', {
        method: 'POST',
        body: data
      });
    }
  } catch (error) {
    console.error('RAG搜索失败:', error);
    return NextResponse.json(
      { success: false, message: '搜索失败' },
      { status: 500 }
    );
  }
} 