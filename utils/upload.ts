import { fetchApi } from './fetch';

const ALLOWED_AUDIO_TYPES: string[] = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/m4a',
  'audio/webm',
];

const ALLOWED_IMAGE_TYPES: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export async function getUploadUrl(fileName: string, fileType: string) {
  if (!ALLOWED_AUDIO_TYPES.includes(fileType)) {
    throw new Error(`不支持的文件类型。支持的类型: ${ALLOWED_AUDIO_TYPES.join(', ')}`);
  }

  const response = await fetchApi('/audio/upload-url', {
    method: 'POST',
    body: JSON.stringify({ fileName, fileType }),
  });
  return response.data;
}

export async function uploadFile(file: File): Promise<string> {
  try {
    // 获取当前日期
    const today = new Date();
    const date = today.toISOString().split('T')[0]; // 格式: YYYY-MM-DD

    // 判断文件类型
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type);

    if (!isImage && !isAudio) {
      throw new Error(`不支持的文件类型。支持的图片类型: ${ALLOWED_IMAGE_TYPES.join(', ')}\n支持的音频类型: ${ALLOWED_AUDIO_TYPES.join(', ')}`);
    }

    // 根据文件类型选择不同的上传端点
    const endpoint = isImage ? '/api/image/upload-url' : '/api/audio/upload-url';

    // 获取上传 URL
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        date: date,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '获取上传 URL 失败');
    }

    const { data } = await response.json();
    const { uploadUrl, key } = data;

    // 上传文件
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('文件上传失败');
    }

    // 返回完整的 CloudFront URL
    return key;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
} 