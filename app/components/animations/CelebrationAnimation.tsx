"use client";

import React from "react";
import { PartyPopper } from "lucide-react";

const CelebrationAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 半透明蒙层 - 使用渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/80 backdrop-blur-[2px]" />
      
      {/* 动画容器 */}
      <div className="relative flex flex-col items-center gap-6 scale-in-center">
        {/* 图标容器 - 添加发光效果 */}
        <div className="relative">
          {/* 背景光晕 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
          
          {/* 图标 */}
          <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce-gentle">
            <PartyPopper className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* 文字 - 使用渐变色和发光效果 */}
        <div className="text-center slide-up-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
            animate-gradient-x">
            Congratulations!
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CelebrationAnimation;

// 在同一个文件中添加所需的CSS动画
const styles = `
@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes scale-in-center {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slide-up-fade-in {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
  background-size: 200% 200%;
}

.scale-in-center {
  animation: scale-in-center 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.slide-up-fade-in {
  animation: slide-up-fade-in 0.5s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}
`;

// 将样式添加到 document 中
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 