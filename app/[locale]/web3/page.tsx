"use client";

import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import ThemeText from "@/app/components/common/ThemeText";
import GradientButton from "@/app/components/common/GradientButton";
import { useParams } from "next/navigation";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";
import { useEffect, useRef } from "react";

export default function Web3HomePage() {
  const t = useTranslations("HomePage");
  const params = useParams();
  const locale = (params.locale as string) || "zh-cn";
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
    <Box className="relative">
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-blue-900">
        <div ref={containerRef} className="w-full h-full">
          <AnimatedBackground />
        </div>
      </div>

      {/* 内容 */}
      <div className="relative">
        <StaticAppHeader />

        {/* Hero Section */}
        <Box className="min-h-screen flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                MMC Audio Web3
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto">
                {t("description")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <GradientButton
                  href={`/${locale}/web3/course`}
                  className="px-8 py-3 text-lg"
                >
                  {t("buttons.browse")}
                </GradientButton>
                <GradientButton
                  href={`/${locale}/web3/swap`}
                  className="px-8 py-3 text-lg"
                >
                  {t("buttons.token")}
                </GradientButton>
              </div>
            </div>
          </div>
        </Box>

        {/* Features Section */}
        <Box className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("features.title")}
              </h2>
              <p className="text-xl text-gray-300">
                {t("features.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: "🎓",
                  title: t("features.learning.title"),
                  description: t("features.learning.description"),
                },
                {
                  icon: "🏆",
                  title: t("features.nft.title"),
                  description: t("features.nft.description"),
                },
                {
                  icon: "💎",
                  title: t("features.token.title"),
                  description: t("features.token.description"),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-5xl mb-6">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* How it Works Section */}
        <Box className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("howItWorks.title")}
              </h2>
              <p className="text-xl text-gray-300">
                {t("howItWorks.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: 1,
                  title: t("howItWorks.step1.title"),
                  description: t("howItWorks.step1.description"),
                },
                {
                  step: 2,
                  title: t("howItWorks.step2.title"),
                  description: t("howItWorks.step2.description"),
                },
                {
                  step: 3,
                  title: t("howItWorks.step3.title"),
                  description: t("howItWorks.step3.description"),
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
                >
                  <div className="absolute -left-4 -top-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white transform -rotate-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 mt-6 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* CTA Section */}
        <Box className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              {t("cta.title")}
            </h2>
            <GradientButton
              href={`/${locale}/web3/course`}
              className="px-12 py-6 text-xl"
            >
              {t("cta.button")}
            </GradientButton>
          </div>
        </Box>
      </div>
    </Box>
  );
}
