import { apiRequest } from '@/utils/apiUtils';

export async function GET(req: Request, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  const { key } = params;
  return apiRequest(`/audio/url/${encodeURIComponent(key)}`);
} 