"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/fetch";
import ScrollPagedContent from "@/app/components/common/scrollPagedContent";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";

interface AudioScene {
  sceneId: string;
  userId: string;
  content: string;
  audioUrl: string;
  sceneName: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function PlayScene() {
  const searchParams = useSearchParams();
  const sceneId = searchParams.get("sceneId");

  const [scene, setScene] = useState<AudioScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScene = async () => {
      if (!sceneId) {
        setError("场景ID不能为空");
        setLoading(false);
        return;
      }

      try {
        // 1. 获取场景信息
        const response = await fetchApi(`/audio-scene/${sceneId}`);
        if (response.success) {
          // 2. 获取音频 URL
          const audioResponse = await fetchApi(
            `/audio/url/${encodeURIComponent(response.data.audioUrl)}`
          );
          if (audioResponse.success) {
            setScene({
              ...response.data,
              audioUrl: audioResponse.data.url, // 使用预签名 URL
            });
            setError(null);
          } else {
            setError("获取音频失败");
          }
        } else {
          setError(response.message || "加载场景失败");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载场景失败");
      } finally {
        setLoading(false);
      }
    };

    fetchScene();
  }, [sceneId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !scene) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || "场景不存在"}</div>
      </div>
    );
  }

  return (
    <div>
      <ScrollPagedContent
        audioUrl={scene.audioUrl}
        name={scene.sceneName}
        text={scene.content}
      />
    </div>
  );
}
