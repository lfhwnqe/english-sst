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

interface CourseMetadata {
  name: string;
  description: string;
  image: string;
}

export default function CoursePlayPage() {
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
          console.log("课程信息:", {
            ...courseInfo,
            metadata: data,
          });
        }
      } catch (error) {
        console.error("获取数据失败:", error);
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
        console.error("通知预言机失败:", error);
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
                  已获得课程完成认证 NFT
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
            您的浏览器不支持视频播放
          </video>
        </Box>

        <Box className="mb-6">
          <Typography variant="h6" className="mb-2 font-bold">
            课程简介
          </Typography>
          <Typography className="text-gray-600">
            {metadata?.description || "暂无简介"}
          </Typography>
        </Box>

        {/* 课程信息 */}
        <Box className="bg-gray-50 rounded-lg p-4 mb-6">
          <Typography variant="h6" className="mb-3 font-bold">
            课程信息
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography className="text-gray-500 text-sm">课程ID</Typography>
              <Typography className="font-medium">
                {courseInfo.web2CourseId}
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">价格</Typography>
              <Typography className="font-medium">
                {Number(courseInfo.price)} MMC
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">创建者</Typography>
              <Typography className="font-medium truncate">
                {courseInfo.creator}
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-500 text-sm">状态</Typography>
              <Typography className="font-medium">
                {courseInfo.completed ? "已完成" : "学习中"}
              </Typography>
            </div>
          </div>
        </Box>

        {courseInfo.completed && metadata?.image && (
          <Box className="bg-white rounded-lg p-6 border border-blue-100 shadow-sm">
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
                  课程完成认证 NFT
                </Typography>
                <Typography className="text-gray-600 mb-2">
                  恭喜你已完成 {courseInfo.name} 课程！
                </Typography>
                <Typography className="text-sm text-gray-500">
                  NFT ID: #{courseInfo.web2CourseId}
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
