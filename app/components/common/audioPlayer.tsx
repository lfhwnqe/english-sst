"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Howl } from "howler";

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

  useEffect(() => {
    const newSound: Howl = new Howl({
      src: [src],
      loop: isLooping,
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
    setSound(newSound);

    return () => {
      newSound.unload();
    };
  }, [src, isLooping, speed]);

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

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (sound) {
      sound.loop(!isLooping);
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
    <div className="p-4  shadow-md rounded-lg max-w-md mx-auto flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>
        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full ${
            isLooping ? "bg-green-500" : "bg-gray-300"
          } text-white w-12 h-12 flex items-center justify-center`}
        >
          🔁
        </button>
      </div>
      <div
        ref={progressRef}
        onClick={seek}
        className="w-full h-2 bg-gray-300 rounded-md relative cursor-pointer"
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
          className={`px-4 py-2 rounded-md ${
            speed === 0.5 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          -
        </button>
        <button
          onClick={() => changeSpeed(1)}
          className={`px-4 py-2 rounded-md ${
            speed === 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {`${speed.toFixed(2)}`}
        </button>
        <button
          onClick={addSpeed}
          className={`px-4 py-2 rounded-md ${
            speed === 1.5 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          +
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
