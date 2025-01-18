"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { useReadContract } from "wagmi";
import { CourseMarket__factory } from "@/abi/typechain-types";
import { useAtomValue } from "jotai";
import { courseMarketAddressAtom } from "@/app/stores/web3";

interface CourseMetadata {
  name: string;
  description: string;
  image: string;
}

interface CourseInfo {
  web2CourseId: string;
  name: string;
  price: bigint;
  isActive: boolean;
  creator: string;
  purchased: boolean;
  metadataURI: string;
  videoURI: string;
}

export default function CoursePlayPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const [metadata, setMetadata] = useState<CourseMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从合约读取课程信息
  const { data: courseData } = useReadContract({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    functionName: "getCoursesByPage",
    args: [
      "0x0000000000000000000000000000000000000000",
      BigInt(0),
      BigInt(10),
    ],
  });

  // 找到对应的课程信息
  const courseInfo = courseData?.[0]?.find(
    (course: CourseInfo) => course.web2CourseId === courseId
  );

  useEffect(() => {
    const fetchCourseMetadata = async () => {
      if (!courseInfo?.metadataURI) return;
      
      try {
        const response = await fetch(courseInfo.metadataURI);
        const data: CourseMetadata = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("获取课程元数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseMetadata();
  }, [courseInfo]);

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
        <Typography variant="h4" className="mb-6 font-bold">
          {metadata?.name || courseInfo.name}
        </Typography>

        <Box className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video
            className="w-full h-full"
            controls
            autoPlay
            controlsList="nodownload"
            src={courseInfo.videoURI}
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
      </Box>
    </Box>
  );
} 