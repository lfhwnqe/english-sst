import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";

export default function Web3Loading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建交错动画序列
    squaresRef.current.forEach((square, index) => {
      if (!square) return;

      // 设置初始状态
      gsap.set(square, {
        opacity: 0.3,
        scale: 0.8,
        rotate: 45,
      });

      // 创建动画时间线
      const tl = gsap.timeline({
        repeat: -1,
        delay: index * 0.15,
      });

      // 添加动画序列
      tl.to(square, {
        opacity: 0.9,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(square, {
        opacity: 0.3,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
      });
    });

    return () => {
      gsap.killTweensOf(squaresRef.current);
    };
  }, []);

  return (
    <Box className="flex items-center justify-center" ref={containerRef}>
      <div className="relative w-16 h-16">
        {/* 创建4个方块 */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`square-${i}`}
            ref={(el) => (squaresRef.current[i] = el)}
            className="absolute w-4 h-4"
            style={{
              left: `${i % 2 * 10}px`,
              top: `${Math.floor(i / 2) * 10}px`,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(99, 102, 241, 0.9))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 0 10px rgba(56, 189, 248, 0.3),
                inset 0 0 4px rgba(255, 255, 255, 0.4)
              `,
            }}
          >
            {/* 发光效果 */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
                filter: 'blur(1px)',
              }}
            />
          </div>
        ))}

        {/* 背景光效 */}
        <div
          className="absolute inset-[-50%]"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>
    </Box>
  );
} 