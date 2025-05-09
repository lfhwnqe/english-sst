"use client";

import { useEffect } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import './web3.css'; // 我们将在下一步创建这个文件

export default function Web3Page() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    // 确保页面初始位置在顶部
    window.scrollTo(0, 0);

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // 动画只触发一次
          }
        });
      },
      {
        threshold: 0.1, // 当元素10%可见时触发
        rootMargin: '50px' // 提前50px触发
      }
    );

    // 观察所有需要动画的元素
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box className="relative min-h-screen overflow-x-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-blue-900">
        <div className="w-full h-full">
          <AnimatedBackground />
        </div>
      </div>

      {/* 内容 */}
      <div className="relative">
        <StaticAppHeader />

        {/* Hero Section */}
        <Container className="min-h-[calc(100vh-64px)] flex items-center">
          <Box className="text-center max-w-3xl mx-auto py-20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <Typography 
              variant="h2" 
              sx={{ 
                marginBottom: '1.5rem',
                backgroundImage: 'linear-gradient(to right, #60A5FA, #818CF8, #A78BFA)',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {t("description")}
            </Typography>
            <Box className="flex gap-4 justify-center">
              <Button
                variant="contained"
                onClick={() => router.push(`/${locale}/web3/course`)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {t("buttons.browse")}
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push(`/${locale}/web3/swap`)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {t("buttons.token")}
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Features Section */}
        <Box className="min-h-screen bg-black/30 flex items-center">
          <Container className="py-20">
            <Typography 
              variant="h3" 
              sx={{ 
                marginBottom: '3rem',
                color: '#fff',
                textAlign: 'center'
              }}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
            >
              {t("features.title")}
            </Typography>
            <Grid container spacing={6}>
              {/* 课程学习 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all h-full">
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#60A5FA'
                    }}
                  >
                    {t("features.learning.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("features.learning.description")}
                  </Typography>
                </Box>
              </Grid>
              {/* NFT认证 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all h-full">
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#818CF8'
                    }}
                  >
                    {t("features.nft.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("features.nft.description")}
                  </Typography>
                </Box>
              </Grid>
              {/* 代币激励 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all h-full">
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#A78BFA'
                    }}
                  >
                    {t("features.token.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("features.token.description")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* How it works Section */}
        <Box className="min-h-screen flex items-center">
          <Container className="py-20">
            <Typography 
              variant="h3" 
              sx={{ 
                marginBottom: '3rem',
                color: '#fff',
                textAlign: 'center'
              }}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
            >
              {t("howItWorks.title")}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                marginBottom: '4rem',
                color: 'rgb(209 213 219)',
                textAlign: 'center'
              }}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100"
            >
              {t("howItWorks.description")}
            </Typography>
            <Grid container spacing={6}>
              {/* Step 1 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#fff'
                    }}
                  >
                    {t("howItWorks.step1.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("howItWorks.step1.description")}
                  </Typography>
                </Box>
              </Grid>
              {/* Step 2 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#fff'
                    }}
                  >
                    {t("howItWorks.step2.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("howItWorks.step2.description")}
                  </Typography>
                </Box>
              </Grid>
              {/* Step 3 */}
              <Grid item xs={12} md={4}>
                <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: '1rem',
                      color: '#fff'
                    }}
                  >
                    {t("howItWorks.step3.title")}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgb(209 213 219)'
                    }}
                  >
                    {t("howItWorks.step3.description")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box className="min-h-screen bg-black/30 flex items-center">
          <Container>
            <Box className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out text-center max-w-2xl mx-auto">
              <Typography 
                variant="h3" 
                sx={{ 
                  marginBottom: '2rem',
                  color: '#fff',
                  textAlign: 'center'
                }}
              >
                {t("cta.title")}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push(`/${locale}/web3/course`)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-8 py-3"
              >
                {t("cta.button")}
              </Button>
            </Box>
          </Container>
        </Box>
      </div>
    </Box>
  );
}
