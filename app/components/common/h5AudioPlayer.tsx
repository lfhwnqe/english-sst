"use client";
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { Play, Pause, Loader, Plus, Minus } from "lucide-react";

interface AudioPlayerProps {
  src: string;
}

interface TimeUpdateEvent extends Event {
  target: HTMLAudioElement;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = (e: TimeUpdateEvent) => {
        setCurrentTime(e.target.currentTime);
      };

      const handleDurationChange = () => {
        setDuration(audio.duration);
      };

      // 添加事件监听
      audio.addEventListener("timeupdate", handleTimeUpdate as EventListener);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.playbackRate = speed;

      // 清理函数
      return () => {
        audio.removeEventListener(
          "timeupdate",
          handleTimeUpdate as EventListener
        );
        audio.removeEventListener("durationchange", handleDurationChange);
      };
    }
  }, [speed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setError(null);
        audioRef.current.play().catch((err) => {
          console.log("err",err);

          setError("Failed to play audio");
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (event: MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current && !isLoading) {
      const rect = progressRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newTime = (offsetX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changeSpeed = (delta: number) => {
    if (audioRef.current) {
      const newSpeed = Math.max(0.5, Math.min(2, speed + delta));
      setSpeed(newSpeed);
      audioRef.current.playbackRate = newSpeed;
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
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError("Failed to load audio");
          setIsLoading(false);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {error && (
        <div className="w-full p-2 mb-2 bg-red-100 text-red-600 rounded text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* 播放控制按钮 */}
        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
              ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 进度条 */}
        <div className="flex flex-col gap-2">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="w-full h-1 bg-gray-200 rounded-full cursor-pointer relative hover:h-2 transition-all"
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
            disabled={speed <= 0.5 || isLoading}
            className={`p-1 rounded-md transition-colors
              ${speed <= 0.5 || isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm min-w-[60px] text-center">
            {speed.toFixed(2)}x
          </span>
          <button
            onClick={() => changeSpeed(0.05)}
            disabled={speed >= 2 || isLoading}
            className={`p-1 rounded-md transition-colors
              ${speed >= 2 || isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
