"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Howl } from "howler";
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Plus,
  Minus,
  Loader,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);

    const newSound: Howl = new Howl({
      src: [src],
      rate: speed,
      onload: () => {
        setDuration(newSound.duration());
        setIsLoading(false);
      },
      onloaderror: (_, error) => {
        console.log("error:", error);

        setLoadError("Failed to load audio");
        setIsLoading(false);
      },
      onplayerror: () => {
        setLoadError("Failed to play audio");
        setIsLoading(false);
        setIsPlaying(false);
      },
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

    newSound.loop(isLooping);
    setSound(newSound);

    return () => {
      newSound.unload();
    };
  }, [src]);

  const togglePlay = () => {
    if (sound && !isLoading) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAudio = () => {
    if (sound && !isLoading) {
      sound.seek(0);
      setProgress(0);
      if (isPlaying) {
        sound.play();
      }
    }
  };

  const toggleLoop = () => {
    if (sound && !isLoading) {
      const newLoopState = !isLooping;
      setIsLooping(newLoopState);
      sound.loop(newLoopState);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    if (sound && !isLoading) {
      sound.rate(newSpeed);
      setSpeed(newSpeed);
    }
  };

  const addSpeed = () => {
    const newSpeed = Math.min(speed + 0.05, 2);
    changeSpeed(newSpeed);
  };

  const minusSpeed = () => {
    const newSpeed = Math.max(speed - 0.05, 0.5);
    changeSpeed(newSpeed);
  };

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    if (sound && !isLoading && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newProgress = (offsetX / rect.width) * duration;
      sound.seek(newProgress);
      setProgress(newProgress);
    }
  };

  return (
    <div className="p-4 shadow-md rounded-lg max-w-md mx-auto flex flex-col items-center gap-2">
      {loadError && (
        <div className="w-full p-2 bg-red-100 text-red-600 rounded text-center">
          {loadError}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={togglePlay}
          disabled={isLoading || !!loadError}
          className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
            ${
              isLoading || loadError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
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
          disabled={isLoading || !!loadError}
          className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
            ${
              isLoading || loadError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleLoop}
          disabled={isLoading || !!loadError}
          className={`p-2 rounded-full text-white w-8 h-8 flex items-center justify-center transition-colors
            ${
              isLoading || loadError
                ? "bg-gray-400 cursor-not-allowed"
                : isLooping
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={progressRef}
        onClick={seek}
        className={`w-full h-1 rounded-md relative cursor-pointer 
          ${isLoading ? "animate-pulse bg-gray-300" : "bg-gray-200"}`}
      >
        <div
          style={{ width: `${(progress / duration) * 100}%` }}
          className="h-full bg-blue-500 rounded-md"
        ></div>
      </div>
      <div className="text-sm text-gray-500 w-full flex justify-between">
        <span>{formatTime(progress)}</span>
        <div className="flex gap-2 items-center">
          <button
            onClick={minusSpeed}
            disabled={isLoading || !!loadError || speed <= 0.5}
            className={`p-2 rounded-md text-white transition-colors
            ${
              isLoading || loadError || speed <= 0.5
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Minus className="w-2 h-2" />
          </button>
          <span className="min-w-[60px] text-center">
            {`${speed.toFixed(2)}x`}
          </span>
          <button
            onClick={addSpeed}
            disabled={isLoading || !!loadError || speed >= 2}
            className={`p-2 rounded-md text-white transition-colors
            ${
              isLoading || loadError || speed >= 2
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Plus className="w-2 h-2" />
          </button>
        </div>
        <span>{formatTime(duration)}</span>
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
