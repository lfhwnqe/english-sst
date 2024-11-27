"use client";
import { useEffect, useState } from "react";

// hooks/useAudioCache.ts
export const useAudioCache = (url: string) => {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const checkCache = async () => {
      if ("caches" in window) {
        const cache = await caches.open("audio-cache");
        const response = await cache.match(url);
        setIsCached(!!response);
      }
    };
    checkCache();
  }, [url]);

  return isCached;
};
