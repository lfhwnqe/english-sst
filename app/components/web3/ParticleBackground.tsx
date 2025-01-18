"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const particles: Particle[] = [];
    const particleCount = 50;
    const connectionDistance = 150;
    let width = 0;
    let height = 0;

    // 调整画布大小
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };

    // 创建粒子
    const createParticle = (): Particle => {
      const element = document.createElement('div');
      element.className = 'absolute w-[3px] h-[3px] rounded-full bg-blue-400/80 shadow-[0_0_8px_rgba(96,165,250,0.9)]';
      container.appendChild(element);

      return {
        element,
        x: Math.random() * width,
        y: Math.random() * height * 0.7 + height * 0.3, // 主要分布在下半部分
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      };
    };

    // 更新粒子位置
    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检查
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < height * 0.3 || particle.y > height) particle.vy *= -1;

      // 更新DOM元素位置
      gsap.set(particle.element, {
        left: particle.x,
        top: particle.y,
        xPercent: -50,
        yPercent: -50,
      });
    };

    // 绘制连线
    const drawConnections = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // 动画循环
    const animate = () => {
      particles.forEach(updateParticle);
      drawConnections();
      requestAnimationFrame(animate);
    };

    // 初始化
    resizeCanvas();
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    animate();

    // 清理函数
    return () => {
      particles.forEach(p => p.element.remove());
      cancelAnimationFrame(animate as any);
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0">
      {/* 网格背景 */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#4444440a_1px,transparent_1px),linear-gradient(to_bottom,#4444440a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />
      
      {/* Canvas用于绘制连线 */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* 容器用于放置粒子 */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
} 