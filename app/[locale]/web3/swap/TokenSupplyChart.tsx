"use client";

import { Box, Typography } from "@mui/material";
import {
  useWriteContract,
  useReadContract,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import { MMCToken__factory } from "@/abi/typechain-types";
import { useAtomValue } from "jotai";
import { mmcTokenAddressAtom } from "@/app/stores/web3";
import GradientButton from "../../../components/common/GradientButton";
import { useState } from "react";
import TokenInput from "../../../components/web3/TokenInput";
import { ArrowUpDown } from "lucide-react";
import ThemeAlert from "../../../components/common/ThemeAlert";
import { useTranslations } from "next-intl";

interface TokenSupplyChartProps {
  totalSupply: string;
}

export default function TokenSupplyChart({
  totalSupply,
}: TokenSupplyChartProps) {
  const t = useTranslations("SwapPage");
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isETHToMMC, setIsETHToMMC] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // 读取用户余额
  const { data: balance = "0", refetch: refetchBalance } = useReadContract({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // 监听 TokensSold 事件
  useWatchContractEvent({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    eventName: "TokensSold",
    onLogs(logs) {
      for (const log of logs) {
        // 只处理当前待处理的交易
        if (!isPending) continue;

        if (log.args && log.args.seller === address) {
          // 交易已确认，直接更新状态
          refetchBalance();
          setIsPending(false);
          setAlert({
            open: true,
            message: t("swapSuccess"),
            severity: "success",
          });
          setInputAmount("");
          break;
        }
      }
    },
  });

  // 如果是 ETH 到 MMC 的兑换，需要监听 TokensPurchased 事件
  useWatchContractEvent({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    eventName: "TokensPurchased",
    onLogs(logs) {
      for (const log of logs) {
        // 只处理当前待处理的交易
        if (!isPending) continue;

        if (log.args && log.args.buyer === address) {
          // 交易已确认，直接更新状态
          refetchBalance();
          setIsPending(false);
          setAlert({
            open: true,
            message: t("swapSuccess"),
            severity: "success",
          });
          setInputAmount("");
          break;
        }
      }
    },
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleSwap = async () => {
    if (!inputAmount || Number(inputAmount) <= 0) return;

    try {
      setIsPending(true);
      setAlert({
        open: true,
        message: t("swapPending"),
        severity: "success",
      });

      if (isETHToMMC) {
        await writeContract({
          address: mmcTokenAddress as `0x${string}`,
          abi: MMCToken__factory.abi,
          functionName: "buyWithETH",
          value: BigInt(Number(inputAmount) * 1e18),
        });
      } else {
        await writeContract({
          address: mmcTokenAddress as `0x${string}`,
          abi: MMCToken__factory.abi,
          functionName: "sellTokens",
          args: [BigInt(Number(inputAmount))],
        });
      }
    } catch (error: unknown) {
      console.error("兑换失败:", error);
      setIsPending(false);

      const err = error as Error;
      if (
        err.message?.includes("User rejected") ||
        (error as unknown as { code: number }).code === 4001
      ) {
        setAlert({
          open: true,
          message: t("swapCancel"),
          severity: "error",
        });
      } else {
        setAlert({
          open: true,
          message: t("swapFailed"),
          severity: "error",
        });
      }
      setInputAmount("");
    }
  };

  const expectedOutput = Number(inputAmount || 0) * (isETHToMMC ? 1000 : 0.001);

  return (
    <>
      <Box className="flex flex-col gap-6 mb-8 max-w-md mx-auto w-full">
        {/* MMC Token 总供应量和用户余额 */}
        <Box
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 
          ring-1 ring-gray-200/50 dark:ring-gray-700/50 
          hover:ring-blue-500/30 dark:hover:ring-blue-400/30
          transition-all duration-300"
        >
          <div className="space-y-4">
            {/* 总供应量 */}
            <div>
              <Typography className="text-sm text-gray-500 dark:text-gray-400">
                {t("totalSupply", { amount: totalSupply })}
              </Typography>
              <Typography
                variant="h4"
                className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                {Number(totalSupply).toLocaleString()} MMC
              </Typography>
              <Typography className="text-xs text-gray-500 dark:text-gray-400">
                {t("fixedSupply")}
              </Typography>
            </div>

            {/* 用户余额 */}
            <div>
              <Typography className="text-sm text-gray-500 dark:text-gray-400">
                {t("myBalance")}
              </Typography>
              <Typography
                variant="h5"
                className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                {Number(balance).toLocaleString()} MMC
              </Typography>
            </div>
          </div>
        </Box>

        {/* Token 兑换 */}
        <Box
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 
          ring-1 ring-gray-200/50 dark:ring-gray-700/50 
          hover:ring-blue-500/30 dark:hover:ring-blue-400/30
          transition-all duration-300"
        >
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {isETHToMMC ? t("ethToMMC") : t("mmcToEth")}
          </Typography>

          <div className="flex flex-col gap-4 mt-4">
            {/* 输入框 */}
            <TokenInput
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              tokenSymbol={isETHToMMC ? "ETH" : "MMC"}
              tokenIcon={
                isETHToMMC
                  ? "https://token-icons.s3.amazonaws.com/eth.png"
                  : "/icon-192x192.png"
              }
            />

            {/* 切换按钮 */}
            <button
              onClick={() => setIsETHToMMC(!isETHToMMC)}
              disabled={isPending}
              className="flex justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>

            {/* 输出框 */}
            <TokenInput
              value={expectedOutput}
              disabled
              tokenSymbol={isETHToMMC ? "MMC" : "ETH"}
              tokenIcon={
                !isETHToMMC
                  ? "https://token-icons.s3.amazonaws.com/eth.png"
                  : "/icon-192x192.png"
              }
            />

            {/* 兑换按钮 */}
            <GradientButton
              onClick={handleSwap}
              disabled={!inputAmount || Number(inputAmount) <= 0 || isPending}
              className="w-full"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {t("swapPending")}
                </div>
              ) : (
                t("swap")
              )}
            </GradientButton>
          </div>
        </Box>
      </Box>

      <ThemeAlert
        open={alert.open}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </>
  );
}
