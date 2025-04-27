import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    return apiRequest('/rag/documents', {
      method: 'POST',
      body: data
    });
  } catch (error) {
    console.error('上传RAG文档失败:', error);
    return NextResponse.json(
      { success: false, message: '上传文档失败' },
      { status: 500 }
    );
  }
} 