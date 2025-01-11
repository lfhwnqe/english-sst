"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { CourseMarket__factory } from "@/abi/typechain-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import { courseMarketAddressAtom } from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import { formatEther } from "viem";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";

interface Course {
  web2CourseId: string;
  name: string;
  price: bigint;
  creator: string;
  isActive: boolean;
}

export default function CourseListPage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const { address } = useAccount();

  const courseMarketContract = {
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
  } as const;

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...courseMarketContract,
        functionName: "getCoursesByPage",
        args: [BigInt(0), BigInt(10)],
      },
    ],
  });
  const { courseCount, courses } = useMemo(() => {
    if (data?.[0]?.status === "success") {
      return {
        courseCount: data?.[0]?.result[1],
        courses: data?.[0]?.result[0],
      };
    }
    return {
      courseCount: 0,
      courses: [],
    };
  }, [data]);

  return (
    <Box className="max-w-7xl mx-auto p-6">
      <StaticAppHeader />
      {isLoading ? (
        <Box className="flex justify-center items-center min-h-[400px]">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" className="mb-6 font-bold">
            课程列表
          </Typography>

          <Typography variant="subtitle1" className="mb-4">
            总课程数: {courseCount?.toString() || "0"}
          </Typography>

          <Grid container spacing={3}>
            {(courses as Course[])?.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course.web2CourseId}>
                <Card className="h-full">
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {course.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-2"
                    >
                      课程ID: {course.web2CourseId}
                    </Typography>

                    <Typography variant="h6" color="primary" className="mb-2">
                      {formatEther(course.price)} MMC
                    </Typography>

                    <Box className="flex gap-2 mt-4">
                      <Chip
                        label={course.isActive ? "可购买" : "已下架"}
                        color={course.isActive ? "success" : "default"}
                      />
                      {course.creator === address && (
                        <Chip label="我创建的" color="primary" />
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      display="block"
                      className="mt-2"
                    >
                      创建者: {course.creator}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {(!courses || (courses as Course[]).length === 0) && (
            <Box className="text-center py-8">
              <Typography variant="h6" color="text.secondary">
                暂无课程
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
