import { apiRequest } from '@/utils/apiUtils';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('OpenRouter Test Request:', body);
  
  return apiRequest('/ai/openrouter-test', {
    method: 'POST',
    body
  });
} 