import { apiRequest } from '@/utils/apiUtils';

export async function GET(req: Request, props: { params: Promise<{ sceneId: string }> }) {
  const params = await props.params;
  const { sceneId } = params;
  return apiRequest(`/audio-scene/${sceneId}`);
}

export async function DELETE(req: Request, props: { params: Promise<{ sceneId: string }> }) {
  const params = await props.params;
  const { sceneId } = params;
  return apiRequest(`/audio-scene/${sceneId}`, {
    method: 'DELETE'
  });
} 