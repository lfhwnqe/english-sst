"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";
import { Book, Medal } from "lucide-react";
import CourseList from "@/app/components/web3/CourseList";
import { useTranslations } from "next-intl";
import NFTList from "@/app/components/web3/NFTList";

interface TabOption {
  id: number;
  label: string;
  icon: React.ReactNode;
}

export default function MyAssetsPage() {
  const t = useTranslations("UserCenter");
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs: TabOption[] = [
    { id: 0, label: t("myCourses"), icon: <Book className="w-5 h-5" /> },
    { id: 1, label: t("myNFTs"), icon: <Medal className="w-5 h-5" /> },
  ];

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
          <div className="flex gap-12">
            {/* 左侧 Tab */}
            <div className="w-48 shrink-0">
              <Typography variant="h5" className="mb-6 font-bold text-white">
                {t("myAssets")}
              </Typography>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-500/30' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 min-w-0">
              {activeTab === 0 ? (
                <CourseList showPurchaseButton={false} onlyPurchased={true} />
              ) : (
                <NFTList />
              )}
            </div>
          </div>
        </Box>
      </div>
    </Box>
  );
}
