import { fetchApi } from './fetch';

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/m4a',
  'audio/webm',
] as const;

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

export async function uploadFile(file: File) {
  // 验证文件类型
  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    throw new Error(`不支持的文件类型。支持的类型: ${ALLOWED_AUDIO_TYPES.join(', ')}`);
  }

  // 1. 获取预签名 URL
  const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
  
  // 2. 使用预签名 URL 上传文件
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  
  return key;
} 