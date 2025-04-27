import { apiRequest } from '@/utils/apiUtils';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('RAG Chat 请求:', body);
  
  return apiRequest('/ai/rag-chat', {
    method: 'POST',
    body
  });
} 