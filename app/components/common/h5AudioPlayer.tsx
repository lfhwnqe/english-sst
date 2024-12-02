"use client";

import { memo, useRef, useState, useEffect, MouseEvent } from "react";
import {
  Play,
  Pause,
  Loader,
  Plus,
  Minus,
  RotateCcw,
  Repeat,
} from "lucide-react";
import dynamic from "next/dynamic";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayerComponent = ({ src }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 初始化音频元素
  useEffect(() => {
    setIsLoading(true);
    setAudioReady(false);
    setError(null);

    if (audioRef.current) {
      const audio = audioRef.current;

      // 重置音频元素
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);

      // 显式加载
      audio.load();
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleDurationChange = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      const handleLoadedMetadata = () => {
        setIsLoading(false);
        setAudioReady(true);
        handleDurationChange();
      };

      const handleLoadStart = () => {
        setIsLoading(true);
        setAudioReady(false);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        setAudioReady(true);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("canplay", handleCanPlay);

      audio.playbackRate = speed;
      audio.loop = isLooping;

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [speed, isLooping]);

  const togglePlay = async () => {
    if (audioRef.current && audioReady) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          setError(null);
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("Playback error:", err);
        setError("Failed to play audio");
        setIsPlaying(false);
      }
    }
  };

  const handleProgressClick = (event: MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current && audioReady) {
      const rect = progressRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newTime = (offsetX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changeSpeed = (delta: number) => {
    if (audioRef.current && audioReady) {
      const newSpeed = Math.max(0.5, Math.min(2, speed + delta));
      setSpeed(newSpeed);
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleLoop = () => {
    if (audioRef.current && audioReady) {
      setIsLooping(!isLooping);
      audioRef.current.loop = !isLooping;
    }
  };

  const resetAudio = async () => {
    if (audioRef.current && audioReady) {
      const wasPlaying = isPlaying;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (wasPlaying) {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.error("Playback error:", err);
          setError("Failed to play audio");
          setIsPlaying(false);
        }
      }
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 shadow-md rounded-lg max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onError={(e) => {
          console.error("Audio error:", e);
          setError("Failed to load audio");
          setIsLoading(false);
          setAudioReady(false);
        }}
        onEnded={() => !isLooping && setIsPlaying(false)}
      />

      {error && (
        <div className="w-full p-2 mb-2 bg-red-100 text-red-600 rounded text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* 控制按钮 */}
        <div className="flex justify-center gap-2">
          <button
            onClick={togglePlay}
            disabled={isLoading || !audioReady}
            className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
              ${isLoading || !audioReady ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={resetAudio}
            disabled={isLoading || !audioReady}
            className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
              ${isLoading || !audioReady ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleLoop}
            disabled={isLoading || !audioReady}
            className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
              ${
                isLoading || !audioReady
                  ? "bg-gray-400 cursor-not-allowed"
                  : isLooping
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500 hover:bg-gray-600"
              }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* 进度条 */}
        <div className="flex flex-col gap-2">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className={`w-full h-1 bg-gray-200 rounded-full relative transition-all
              ${audioReady ? "cursor-pointer hover:h-2" : "cursor-not-allowed"}`}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 速度控制 */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => changeSpeed(-0.05)}
            disabled={speed <= 0.5 || isLoading || !audioReady}
            className={`p-1 rounded-md transition-colors
              ${speed <= 0.5 || isLoading || !audioReady ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm min-w-[60px] text-center">
            {speed.toFixed(2)}x
          </span>
          <button
            onClick={() => changeSpeed(0.05)}
            disabled={speed >= 2 || isLoading || !audioReady}
            className={`p-1 rounded-md transition-colors
              ${speed >= 2 || isLoading || !audioReady ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AudioPlayer = dynamic(() => Promise.resolve(memo(AudioPlayerComponent)), {
  ssr: false,
}) as typeof AudioPlayerComponent;

export default AudioPlayer;
