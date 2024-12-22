import { apiRequest } from '@/utils/apiUtils';

export async function GET() {
  return apiRequest('/auth/user-info');
} 