"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Howl } from "howler";
import { Play, Pause, RotateCcw, Repeat, Plus, Minus } from "lucide-react";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const progressRef = useRef<HTMLDivElement>(null);

  // 主要的 Howl 实例创建
  useEffect(() => {
    const newSound: Howl = new Howl({
      src: [src],
      rate: speed,
      onload: () => setDuration(newSound.duration()),
      onplay: () => {
        const updateProgress = () => {
          if (newSound.playing()) {
            setProgress(newSound.seek() as number);
            requestAnimationFrame(updateProgress);
          }
        };
        requestAnimationFrame(updateProgress);
      },
    });

    // 设置初始循环状态
    newSound.loop(isLooping);
    setSound(newSound);

    return () => {
      newSound.unload();
    };
  }, [src, speed]); // 只在 src 或 speed 改变时重新创建实例

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAudio = () => {
    if (sound) {
      sound.seek(0);
      setProgress(0);
      if (isPlaying) {
        sound.play();
      }
    }
  };

  const toggleLoop = () => {
    if (sound) {
      const newLoopState = !isLooping;
      setIsLooping(newLoopState);
      sound.loop(newLoopState);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (sound) {
      sound.rate(newSpeed);
    }
  };

  const addSpeed = () => {
    changeSpeed(speed + 0.05);
  };

  const minusSpeed = () => {
    changeSpeed(speed - 0.05);
  };

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    if (sound && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newProgress = (offsetX / rect.width) * duration;
      sound.seek(newProgress);
      setProgress(newProgress);
    }
  };

  return (
    <div className="p-4 shadow-md rounded-lg max-w-md mx-auto flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={resetAudio}
          className="p-2 rounded-full bg-gray-300 text-white w-12 h-12 flex items-center justify-center hover:bg-gray-400 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full ${
            isLooping ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 hover:bg-gray-400"
          } text-white w-12 h-12 flex items-center justify-center transition-colors`}
        >
          <Repeat className="w-6 h-6" />
        </button>
      </div>
      <div
        ref={progressRef}
        onClick={seek}
        className="w-full h-2 bg-gray-200 rounded-md relative cursor-pointer"
      >
        <div
          style={{ width: `${(progress / duration) * 100}%` }}
          className="h-full bg-blue-500 rounded-md"
        ></div>
      </div>
      <div className="text-sm text-gray-500 w-full flex justify-between">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={minusSpeed}
          className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="min-w-[60px] text-center">
          {`${speed.toFixed(2)}x`}
        </span>
        <button
          onClick={addSpeed}
          className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default AudioPlayer;