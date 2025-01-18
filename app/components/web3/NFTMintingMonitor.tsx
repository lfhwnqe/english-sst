"use client";

import { useWatchContractEvent } from "wagmi";
import { MMCERC721Coin__factory } from "@/abi/typechain-types";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { Award } from "lucide-react";

interface NFTMintingMonitorProps {
  address: `0x${string}`;
  mmcNFTAddress: `0x${string}`;
  courseName: string;
  onComplete: () => void;
}

export default function NFTMintingMonitor({
  address,
  mmcNFTAddress,
  courseName,
  onComplete,
}: NFTMintingMonitorProps) {
  useWatchContractEvent({
    address: mmcNFTAddress,
    abi: MMCERC721Coin__factory.abi,
    eventName: "NFTMinted",
    onLogs(logs) {
      for (const log of logs) {
        if (log.args && typeof log.args === "object" && "to" in log.args) {
          const { to } = log.args;
          if (to === address) {
            // 3秒后完成
            setTimeout(onComplete, 3000);
          }
        }
      }
    },
  });

  return (
    <>
      {/* NFT 铸造中提示 */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-4"
          >
            <Award className="w-full h-full text-blue-500" />
          </motion.div>
          <Typography variant="h5" className="mb-2">
            🎉 正在铸造课程完成认证 NFT
          </Typography>
          <Typography className="text-gray-600">{courseName}</Typography>
        </motion.div>
      </div>
    </>
  );
}
