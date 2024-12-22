import { apiRequest } from '@/utils/apiUtils';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log('audio-scene searchParams', searchParams);
  return apiRequest('/audio-scene', {
    searchParams: {
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '10',
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  return apiRequest('/audio-scene', {
    method: 'POST',
    body
  });
} 