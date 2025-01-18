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

  // 读取课程列表
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "getUserPurchasedCourses",
        args: [address as `0x${string}`],
      },
    ],
  });

  const { courseCount, courses } = useMemo(() => {
    const [, courseDetails] =
      data?.[0]?.status === "success" ? data[0].result : [];
    if (data?.[0]?.status === "success") {
      return {
        courseCount: courseDetails?.length || 0,
        courses: courseDetails || [],
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
            我的课程
          </Typography>

          <Typography variant="subtitle1" className="mb-4">
            总课程数: {courseCount?.toString() || "0"}
          </Typography>

          <Grid container spacing={3}>
            {(courses as Course[])?.map((course) => (
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
                      {Number(course.price).toString()} MMC
                    </Typography>

                    <Box className="flex gap-2 mt-4">
                      <Chip label={"已购买"} color="success" />
                      {course.creator === address && (
                        <Chip label="我创建的" color="primary" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
