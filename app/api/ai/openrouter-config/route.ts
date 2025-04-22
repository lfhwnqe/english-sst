import { apiRequest } from '@/utils/apiUtils';

export async function GET() {
  return apiRequest('/ai/openrouter-config');
} 