'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/utils/fetch';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface AudioSceneListItem {
  sceneId: string;
  userId: string;
  sceneName: string;
  audioUrl: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PaginatedResponse {
  items: AudioSceneListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AudioSceneList() {
  const [scenes, setScenes] = useState<AudioSceneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

  const fetchScenes = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchApi<{
        success: boolean;
        data: PaginatedResponse;
      }>(`/audio-scene?page=${page}&pageSize=${pageSize}`);

      if (response.success) {
        setScenes(response.data.items);
        setTotalPages(response.data.totalPages);
        setError(null);
      } else {
        setError(response.message || '加载失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('List Page - Delete Request:', id);
      const response = await fetchApi<ApiResponse<any>>(`/audio-scene/${id}`, {
        method: 'DELETE',
      });
      console.log('List Page - Delete Response:', response);
      
      if (response.success) {
        // 删除成功后刷新列表
        const newList = scenes.filter(item => item.sceneId !== id);
        setScenes(newList);
        // 关闭对话框
        setOpenDialog(false);
        setSceneToDelete(null);
      } else {
        throw new Error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">我的场景</h1>
          <button
            onClick={() => window.location.href = '/audio-scene/create'}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            创建新场景
          </button>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : scenes.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            暂无场景，点击右上角创建新场景
          </div>
        ) : (
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div
                key={`${scene.userId}-${scene.createdAt}`}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{scene.sceneName}</h3>
                    <p className="text-gray-400 mb-2">{scene.content}</p>
                    <div className="text-sm text-gray-500">
                      创建时间: {new Date(scene.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/audio-scene/play?sceneId=${scene.sceneId}`}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      播放
                    </button>
                    <button
                      onClick={() => {
                        setSceneToDelete(scene.sceneId);
                        setOpenDialog(true);
                      }}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 分页控件 */}
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                上一页
              </button>
              <span className="px-4 py-2 text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          确定要删除这个场景吗？
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button 
            onClick={() => sceneToDelete && handleDelete(sceneToDelete)}
            color="error"
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 