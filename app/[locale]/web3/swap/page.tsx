"use client";

import TokenSupplyChart from "./TokenSupplyChart";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { MMCToken__factory } from "@/abi/typechain-types";
import { useAtomValue } from "jotai";
import { mmcTokenAddressAtom } from "@/app/stores/web3";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";

export default function SwapPage() {
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);
  const [lastEventTimestamp, setLastEventTimestamp] = useState<number>(0);

  const { data: totalSupply = "0", refetch: refetchTotalSupply } = useReadContract({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    functionName: "totalSupply",
  });

  // 监听兑换事件
  useWatchContractEvent({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    eventName: "Transfer",
    onLogs(logs) {
      for (const log of logs) {
        // 检查事件时间戳，避免处理旧事件
        if (log.blockTimestamp <= lastEventTimestamp) {
          continue;
        }

        setLastEventTimestamp(log.blockTimestamp);
        // 刷新总供应量和用户余额
        refetchTotalSupply();
      }
    },
  });

  const t = useTranslations("SwapPage");
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
        {/* 头部导航 */}
        <Box className="max-w-7xl mx-auto px-6">
          <StaticAppHeader />
        </Box>

        {/* 主要内容区 */}
        <Box className="max-w-7xl mx-auto px-6 pt-16">
          {/* 页面标题 */}
          <Typography
            variant="h4"
            className="text-center mb-12 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            {t("title")}
          </Typography>

          {/* 兑换组件 */}
          <TokenSupplyChart totalSupply={totalSupply.toString()} />
        </Box>
      </div>
    </Box>
  );
}
