'use client';

import { useState } from 'react';
import { uploadFile } from '@/utils/upload';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { fetchApi } from '@/utils/fetch';

interface SceneData {
  content: string;
  sceneName: string;
  audioUrl?: string;
  status?: string;
}

export default function CreateAudioScene() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sceneData, setSceneData] = useState<SceneData>({
    content: '',
    sceneName: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSceneData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('请选择音频文件');
      return;
    }

    if (!sceneData.sceneName) {
      setError('请输入场景名称');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. 先上传音频文件
      const audioKey = await uploadFile(file);

      // 2. 保存场景数据
      const response = await fetchApi('/audio-scene', {
        method: 'POST',
        body: JSON.stringify({
          content: sceneData.content,
          sceneName: sceneData.sceneName,
          audioUrl: audioKey,
          status: 'active',
        }),
      });

      setSuccess('场景创建成功！');
      setFile(null);
      setSceneData({ content: '', sceneName: '' });
      
      // 清空文件选择
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">创建新场景</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 场景信息 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">场景名称</label>
              <input
                type="text"
                name="sceneName"
                value={sceneData.sceneName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="输入场景名称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">场景描述</label>
              <textarea
                name="content"
                value={sceneData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={4}
                placeholder="输入场景描述"
              />
            </div>
          </div>

          {/* 音频上传 */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer block text-gray-300 hover:text-white"
            >
              {file ? file.name : '点击选择音频文件'}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file || !sceneData.sceneName}
            className={`w-full py-2 px-4 rounded ${
              loading || !file || !sceneData.sceneName
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '创建中...' : '创建场景'}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm mt-2">{success}</div>
          )}
        </form>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
} 