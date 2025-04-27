import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: '文档ID不能为空' },
        { status: 400 }
      );
    }
    
    return apiRequest(`/rag/documents/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('删除RAG文档失败:', error);
    return NextResponse.json(
      { success: false, message: '删除文档失败' },
      { status: 500 }
    );
  }
} 