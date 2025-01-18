"use client";

import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import ThemeText from "@/app/components/common/ThemeText";
import { useTranslations } from "next-intl";
import CourseList from "@/app/components/web3/CourseList";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";

export default function CourseListPage() {
  const t = useTranslations("CourseList");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrolled = window.scrollY;
      containerRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box className="relative min-h-screen">
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-blue-900">
        <div ref={containerRef} className="w-full h-full">
          <AnimatedBackground />
        </div>
      </div>

      {/* 内容 */}
      <div className="relative">
        <StaticAppHeader />
        <Box className="max-w-7xl mx-auto px-6 py-8">
          <ThemeText variant="h4" className="mb-6 font-bold text-white">
            {t("title")}
          </ThemeText>

          <CourseList showPurchaseButton={true} onlyPurchased={false} />
        </Box>
      </div>
    </Box>
  );
}
