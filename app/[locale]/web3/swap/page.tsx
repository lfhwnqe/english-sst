"use client";

import TokenSupplyChart from "./TokenSupplyChart";
import { useReadContract } from "wagmi";
import { MMCToken__factory } from "@/abi/typechain-types";
import { useAtomValue } from "jotai";
import { mmcTokenAddressAtom } from "@/app/stores/web3";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function SwapPage() {
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);

  const { data: totalSupply = "0" } = useReadContract({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    functionName: "totalSupply",
  });

  const t = useTranslations("SwapPage");

  return (
    <Box>
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
    </Box>
  );
}
