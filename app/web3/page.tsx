"use client";

import { useMemo, useState } from "react";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import {
  CourseMarket__factory,
  MMCToken__factory,
} from "@/abi/typechain-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  courseMarketAddressAtom,
  mmcTokenAddressAtom,
} from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";

interface Course {
  web2CourseId: string;
  name: string;
  price: bigint;
  creator: string;
  isActive: boolean;
  purchased: boolean;
}

export default function CourseListPage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);
  const { address, isConnected } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { writeContract } = useWriteContract();

  // 读取课程列表
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "getCoursesByPage",
        args: [
          address
            ? (address as `0x${string}`)
            : "0x0000000000000000000000000000000000000000",
          BigInt(0),
          BigInt(10),
        ],
      },
    ],
  });

  // 读取代币余额和授权额度，只在用户已连接钱包时才调用
  const { data: tokenData } = useReadContracts({
    contracts: address
      ? [
          {
            address: mmcTokenAddress as `0x${string}`,
            abi: MMCToken__factory.abi,
            functionName: "balanceOf",
            args: [address as `0x${string}`],
          },
          {
            address: mmcTokenAddress as `0x${string}`,
            abi: MMCToken__factory.abi,
            functionName: "allowance",
            args: [
              address as `0x${string}`,
              courseMarketAddress as `0x${string}`,
            ],
          },
        ]
      : [], // 如果未连接钱包，则不调用这些合约方法
  });

  const { courseCount, courses } = useMemo(() => {
    if (data?.[0]?.status === "success") {
      return {
        courseCount: data[0].result[1],
        courses: data[0].result[0],
      };
    }
    return {
      courseCount: 0,
      courses: [],
    };
  }, [data]);

  const { balance, allowance } = useMemo(
    () => ({
      balance: tokenData?.[0]?.status === "success" ? tokenData[0].result : BigInt(0),
      allowance: tokenData?.[1]?.status === "success" ? tokenData[1].result : BigInt(0),
    }),
    [tokenData]
  );

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handlePurchase = async (web2CourseId: string, price: bigint) => {
    if (!isConnected) {
      showMessage("请先连接钱包", "error");
      return;
    }

    if (balance < price) {
      showMessage(`MMC 代币余额不足`, "error");
      return;
    }

    setIsPurchasing(true);
    try {
      // 1. 如果授权额度不足，先授权
      if (allowance < price) {
        await writeContract({
          address: mmcTokenAddress as `0x${string}`,
          abi: MMCToken__factory.abi,
          functionName: "approve",
          args: [courseMarketAddress as `0x${string}`, price],
        });
        showMessage("授权请求已发送", "success");
      }

      // 2. 购买课程
      await writeContract({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "purchaseCourse",
        args: [web2CourseId],
      });
      showMessage("购买请求已发送", "success");
    } catch (error) {
      console.error("购买失败:", error);
      showMessage("购买失败: " + (error as Error).message, "error");
    } finally {
      setIsPurchasing(false);
    }
  };

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
                      <Chip
                        label={course.isActive ? "可购买" : "已下架"}
                        color={course.isActive ? "success" : "default"}
                      />
                      {course.creator === address && (
                        <Chip label="我创建的" color="primary" />
                      )}
                      {course.purchased && <Chip label="已购买" color="info" />}
                    </Box>

                    {course.isActive &&
                      course.creator !== address &&
                      !course.purchased && (
                        <Box className="mt-4">
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() =>
                              handlePurchase(course.web2CourseId, course.price)
                            }
                            disabled={isPurchasing || balance < course.price}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isPurchasing ? (
                              <CircularProgress
                                size={24}
                                className="text-white"
                              />
                            ) : balance < course.price ? (
                              "余额不足"
                            ) : allowance < course.price ? (
                              "需要授权"
                            ) : (
                              `购买课程 (${Number(course.price).toString()} MMC)`
                            )}
                          </Button>
                        </Box>
                      )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
