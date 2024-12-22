import { apiRequest } from '@/utils/apiUtils';

export async function GET(
  req: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;
  return apiRequest(`/audio/url/${encodeURIComponent(key)}`);
} 