import { apiRequest } from '@/utils/apiUtils';

export async function GET(
  req: Request,
  { params }: { params: { sceneId: string } }
) {
  const { sceneId } = params;
  return apiRequest(`/audio-scene/${sceneId}`);
}

export async function DELETE(
  req: Request,
  { params }: { params: { sceneId: string } }
) {
  const { sceneId } = params;
  return apiRequest(`/audio-scene/${sceneId}`, {
    method: 'DELETE'
  });
} 