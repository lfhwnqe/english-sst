"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import {
  CourseMarket__factory,
  MockOracle__factory,
} from "@/abi/typechain-types";
import { useAtomValue } from "jotai";
import {
  courseMarketAddressAtom,
  mockOracleAddressAtom,
  mmcNFTAddressAtom,
} from "@/app/stores/web3";
import { Award } from "lucide-react";
import NFTMintingMonitor from "@/app/components/web3/NFTMintingMonitor";
import { useTranslations } from "next-intl";

interface CourseMetadata {
  name: string;
  description: string;
  image: string;
}

export default function CoursePlayPage() {
  const t = useTranslations("CoursePlay");
  const params = useParams();
  const courseId = params.courseId as string;
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const { address } = useAccount();
  const [metadata, setMetadata] = useState<CourseMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNFTMinting, setIsNFTMinting] = useState(false);

  // 从合约读取课程信息
  const { data: courseData } = useReadContract({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    functionName: "getCoursesByPage",
    args: [address as `0x${string}`, BigInt(0), BigInt(10)],
  });

  // 找到当前课程
  const courseInfo = courseData?.[0]?.find(
    (course) => course.web2CourseId === courseId
  );

  const mockOracleAddress = useAtomValue(mockOracleAddressAtom);
  const { writeContract } = useWriteContract();
  const mmcNFTAddress = useAtomValue(mmcNFTAddressAtom);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!courseInfo) return;

      try {
        // 获取课程元数据
        if (courseInfo.metadataURI) {
          const response = await fetch(courseInfo.metadataURI);
          const data: CourseMetadata = await response.json();
          setMetadata(data);
          console.log(t("courseInfo"), {
            ...courseInfo,
            metadata: data,
          });
        }
      } catch (error) {
        console.error(t("error"), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [courseInfo]);

  // 在组件内修改处理函数
  const handleVideoComplete = async () => {
    if (!courseInfo?.completed) {
      setIsNFTMinting(true);
      try {
        await writeContract({
          address: mockOracleAddress as `0x${string}`,
          abi: MockOracle__factory.abi,
          functionName: "notifyCourseCompletion",
          args: [address as `0x${string}`, courseId],
        });
      } catch (error) {
        console.error(t("error"), error);
        setIsNFTMinting(false);
      }
    }
  };

  if (isLoading || !courseInfo) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="max-w-7xl mx-auto p-6">
      <StaticAppHeader />

      <Box className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Typography variant="h4" className="font-bold">
            {courseInfo.name}
          </Typography>
          {courseInfo.completed && (
            <div className="group relative">
              <Award className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white/90 backdrop-blur-sm 
                p-2 rounded-lg shadow-lg border border-gray-100 opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 w-48"
              >
                <div className="text-xs text-gray-600 text-center">
                  {t("nft.completed")}
                </div>
              </div>
            </div>
          )}
        </div>

        <Box className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video
            className="w-full h-full"
            controls
            controlsList="nodownload"
            src={courseInfo.videoURI}
            onEnded={handleVideoComplete}
          >
            {t("browser.notSupport")}
          </video>
        </Box>

        <Box className="mb-6">
          <Typography variant="h6" className="mb-2 font-bold">
            {t("course.description")}
          </Typography>
          <Typography className="text-gray-600">
            {metadata?.description || "暂无简介"}
          </Typography>
        </Box>

        {/* 课程信息 */}
        <Box className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6">
          <Typography variant="h6" className="mb-3 font-bold">
            {t("course.info")}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography className="text-gray-500 text-sm">{t("course.id")}</Typography>
              <Typography className="font-medium">
                {courseInfo.web2CourseId}
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">{t("course.price")}</Typography>
              <Typography className="font-medium">
                {Number(courseInfo.price)} MMC
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">{t("course.creator")}</Typography>
              <Typography className="font-medium truncate">
                {courseInfo.creator}
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">{t("course.status")}</Typography>
              <Typography className="font-medium">
                {courseInfo.completed ? t("course.completed") : t("course.learning")}
              </Typography>
            </div>
          </div>
        </Box>

        {courseInfo.completed && metadata?.image && (
          <Box className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 
          ring-1 ring-gray-200/50 dark:ring-gray-700/50 
          hover:ring-blue-500/30 dark:hover:ring-blue-400/30
          transition-all duration-300">
            <div className="flex items-start gap-6">
              {/* NFT 图片 */}
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                <img
                  src={metadata.image}
                  alt="Course NFT"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NFT 信息 */}
              <div className="flex-1">
                <Typography
                  variant="h6"
                  className="flex items-center gap-2 text-blue-600 mb-3"
                >
                  <Award className="w-5 h-5" />
                  {t("nft.completed")}
                </Typography>
                <Typography className="text-gray-600 mb-2">
                  {t("nft.congratulations", { courseName: courseInfo.name })}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {t("nft.id")}: {courseInfo.web2CourseId}
                </Typography>
              </div>
            </div>
          </Box>
        )}
      </Box>

      {/* 只在首次完成课程时显示 NFT 铸造监听组件 */}
      {!courseInfo.completed && isNFTMinting && (
        <NFTMintingMonitor
          address={address as `0x${string}`}
          mmcNFTAddress={mmcNFTAddress as `0x${string}`}
          courseName={courseInfo.name}
          onComplete={() => {
            setIsNFTMinting(false);
            window.location.reload();
          }}
        />
      )}
    </Box>
  );
}
