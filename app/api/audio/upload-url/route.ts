import { apiRequest } from '@/utils/apiUtils';

export async function POST(req: Request) {
  const body = await req.json();
  return apiRequest('/audio/upload-url', {
    method: 'POST',
    body
  });
} 