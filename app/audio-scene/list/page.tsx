"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/utils/fetch";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import { Plus, Minus, Settings } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Link from "next/link";

interface AudioSceneListItem {
  sceneId: string;
  userId: string;
  sceneName: string;
  content: string;
  audioUrl: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
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
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchScenes = async (page: number) => {
    try {
      setLoading(true);
      console.log('Fetching scenes:', {
        url: `/audio-scene?page=${page}&pageSize=${pageSize}`,
        page,
        pageSize
      });
      
      const response = await fetchApi(
        `/audio-scene?page=${page}&pageSize=${pageSize}`
      );
      
      console.log('Fetch scenes response:', response);
      
      if (response.success) {
        setScenes(response.data.items);
        setTotalPages(response.data.totalPages);
        setError(null);
      } else {
        setError(response.message || "加载失败");
      }
    } catch (err) {
      console.error('Fetch scenes error:', {
        error: err,
        message: err instanceof Error ? err.message : '未知错误'
      });
      setError(err instanceof Error ? err.message : "加载失败");
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
      console.log("List Page - Delete Request:", id);
      const response = await fetchApi(`/audio-scene/${id}`, {
        method: "DELETE",
      });
      console.log("List Page - Delete Response:", response);

      if (response.success) {
        const newList = scenes.filter((item) => item.sceneId !== id);
        setScenes(newList);
        setOpenDialog(false);
        setSceneToDelete(null);
      } else {
        throw new Error(response.message || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
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
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-2 rounded-full transition-colors ${
              isEditMode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : scenes.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            暂无场景，点击右下角添加新场景
          </div>
        ) : (
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div
                key={scene.sceneId}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors relative group"
              >
                {isEditMode && (
                  <button
                    onClick={() => {
                      setSceneToDelete(scene.sceneId);
                      setOpenDialog(true);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-600 rounded-full group-hover:opacity-100 transition-opacity"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                )}

                <div
                  onClick={() => !isEditMode && (window.location.href = `/audio-scene/play?sceneId=${scene.sceneId}`)}
                  className={`${!isEditMode ? 'cursor-pointer' : ''}`}
                >
                  <h3 className="text-xl font-semibold mb-3">{scene.sceneName}</h3>
                  <p className="text-gray-400 mb-3 line-clamp-2">{scene.content}</p>
                  <div className="text-sm text-gray-500">
                    创建时间: {new Date(scene.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {isEditMode && (
              <Link
                href="/audio-scene/create"
                className="fixed bottom-8 right-8 p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus className="w-6 h-6" />
              </Link>
            )}

            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
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
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>确定要删除这个场景吗？</DialogContent>
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
