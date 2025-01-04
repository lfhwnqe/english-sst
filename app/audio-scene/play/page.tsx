"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/fetch";
import ScrollPagedContent from "@/app/components/common/scrollPagedContent";

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

  const [scene, setScene] = useState<AudioScene>({
    sceneId: "",
    userId: "",
    content: "",
    audioUrl: "",
    sceneName: "加载中...",
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchScene = async () => {
      if (!sceneId) {
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
          }
        }
      } catch (err) {
        console.error("Error fetching scene:", err);
      }
    };

    fetchScene();
  }, [sceneId]);

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
