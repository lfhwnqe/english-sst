"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/utils/fetch";
import ListSkeleton from "./components/ListSkeleton";
import { Plus, Minus, Settings } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Link from "next/link";
import StaticAppHeader from "@/app/components/common/header/staticAppHeader";

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
  const [, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchScenes = async (page: number) => {
    try {
      setLoading(true);
      console.log("Fetching scenes:", {
        url: `/audio-scene?page=${page}&pageSize=${pageSize}`,
        page,
        pageSize,
      });

      const response = await fetchApi(
        `/audio-scene?page=${page}&pageSize=${pageSize}`
      );

      console.log("Fetch scenes response:", response);

      if (response.success) {
        setScenes(response.data.items);
        setTotalPages(response.data.totalPages);
        setError(null);
      } else {
        setError(response.message || "加载失败");
      }
    } catch (err) {
      console.error("Fetch scenes error:", {
        error: err,
        message: err instanceof Error ? err.message : "未知错误",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground p-8">
      <StaticAppHeader />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            我的场景
          </h1>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`relative p-2.5 rounded-xl transition-all duration-300 ${
              isEditMode
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20"
                : "bg-white dark:bg-gray-800 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <Settings
              className={`w-5 h-5 ${
                isEditMode ? "text-white" : "text-gray-800 dark:text-gray-200"
              }`}
            />
          </button>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : scenes.length === 0 ? (
          <div className="text-foreground/60 text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            暂无场景，点击右下角添加新场景
          </div>
        ) : (
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div
                key={scene.sceneId}
                className="group relative bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {isEditMode && (
                  <button
                    onClick={() => {
                      setSceneToDelete(scene.sceneId);
                      setOpenDialog(true);
                    }}
                    className="absolute top-2 right-2 p-2 
                    bg-gradient-to-r from-red-500 to-red-600 
                    text-white rounded-lg 
                    transition-all duration-300 
                    hover:shadow-lg hover:shadow-red-500/20 
                    hover:scale-105 z-20
                    opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}

                <div
                  onClick={() =>
                    !isEditMode &&
                    (window.location.href = `/audio-scene/play?sceneId=${scene.sceneId}`)
                  }
                  className={`relative z-10 ${!isEditMode ? "cursor-pointer" : ""}`}
                >
                  <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                    {scene.sceneName}
                  </h3>
                  <p className="text-foreground/70 mb-3 line-clamp-2">
                    {scene.content}
                  </p>
                  <div className="text-sm text-foreground/50 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50 mr-2" />
                    创建时间: {new Date(scene.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {isEditMode && (
              <Link
                href="/audio-scene/create"
                className="fixed bottom-8 right-8 p-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-6 h-6" />
              </Link>
            )}

            <div className="flex justify-center space-x-3 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 text-white"
                }`}
              >
                上一页
              </button>
              <span className="px-4 py-2 text-foreground/70 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 text-white"
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
