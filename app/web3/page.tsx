"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  courseMarketAddressAtom,
  mmcTokenAddressAtom,
} from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

interface Course {
  web2CourseId: string;
  name: string;
  price: bigint;
  creator: string;
  isActive: boolean;
  purchased: boolean;
  completed: boolean;
}

// 定义元数据接口
interface CourseMetadata {
  name: string;
  description: string;
  image: string;
}

// 添加交易状态类型
type TransactionStep = "approve" | "purchase" | "none";

export default function CourseListPage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);
  const { address, isConnected } = useAccount();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { writeContract } = useWriteContract();
  const router = useRouter();

  // 读取课程列表
  const { data, isLoading, refetch } = useReadContracts({
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
    console.log("data:", data);
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

  const [courseMetadata, setCourseMetadata] = useState<{
    [key: string]: CourseMetadata;
  }>({});

  useEffect(() => {
    const fetchAllMetadata = async () => {
      const metadata: { [key: string]: CourseMetadata } = {};

      await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await fetch(course.metadataURI);
            const data: CourseMetadata = await response.json();
            metadata[course.web2CourseId] = data;
          } catch (error) {
            console.error(`获取课程 ${course.web2CourseId} 元数据失败:`, error);
          }
        })
      );

      setCourseMetadata(metadata);
    };

    if (courses.length > 0) {
      fetchAllMetadata();
    }
  }, [courses]);
  useEffect(() => {
    console.log("courseMetadata:", courseMetadata);
  }, [courseMetadata]);

  const { balance, allowance } = useMemo(
    () => ({
      balance:
        tokenData?.[0]?.status === "success" ? tokenData[0].result : BigInt(0),
      allowance:
        tokenData?.[1]?.status === "success" ? tokenData[1].result : BigInt(0),
    }),
    [tokenData]
  );

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // 在组件中添加状态
  const [currentStep, setCurrentStep] = useState<TransactionStep>("none");

  // 监听购买事件
  useWatchContractEvent({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    eventName: "CoursePurchased",
    onLogs(logs) {
      for (const log of logs) {
        if (log.args && typeof log.args === "object" && "buyer" in log.args) {
          const { buyer } = log.args;
          if (buyer === address) {
            showMessage("课程购买成功！", "success");
            setCurrentStep("none");
            // 刷新课程列表
            refetch();
            break;
          }
        }
      }
    },
  });

  // 修改处理函数
  const handleCourseClick = async (course: Course) => {
    if (!isConnected) {
      showMessage("请先连接钱包", "error");
      return;
    }

    if (course.purchased) {
      router.push(`/web3/course/play/${course.web2CourseId}`);
      return;
    }

    if (balance < course.price) {
      showMessage("MMC 代币余额不足", "error");
      return;
    }

    try {
      // 如果授权额度不足，先请求授权
      if (allowance < course.price) {
        setCurrentStep("approve");
        try {
          await writeContract({
            address: mmcTokenAddress as `0x${string}`,
            abi: MMCToken__factory.abi,
            functionName: "approve",
            args: [courseMarketAddress as `0x${string}`, course.price],
          });
          showMessage("授权请求已发送，请在钱包中确认", "success");
        } catch {
          showMessage("授权已取消", "error");
          setCurrentStep("none");
        }
        return;
      }

      // 发起购买
      setCurrentStep("purchase");
      await writeContract({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "purchaseCourse",
        args: [course.web2CourseId],
      });
      showMessage("购买请求已发送，请在钱包中确认", "success");
    } catch {
      showMessage("购买已取消", "error");
      setCurrentStep("none");
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
                <Card
                  className={`h-full transition-all duration-300 cursor-pointer ${
                    course.completed
                      ? "relative before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:rounded-lg before:-z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
                      : "hover:shadow-lg"
                  }`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) {
                      return;
                    }
                    handleCourseClick(course);
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "240px",
                      overflow: "hidden",
                      position: "relative",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  >
                    <img
                      src={
                        courseMetadata[course.web2CourseId]?.image ||
                        "/icon-512x512.png"
                      }
                      alt={course.name}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    {course.completed && (
                      <div className="absolute top-3 right-3 group">
                        <Award
                          className="w-6 h-6 text-blue-500 relative z-10"
                          strokeWidth={2.5}
                        />
                        {/* NFT Tooltip */}
                        <div
                          className="absolute right-0 top-full mt-2 w-[280px] opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible transition-all duration-200 
                          bg-white/90 backdrop-blur-sm text-gray-800 text-xs rounded-lg 
                          shadow-lg border border-gray-100 z-20 p-3"
                        >
                          <div
                            className="absolute -top-1 right-2 w-2 h-2 bg-white/90 rotate-45 
                            border-l border-t border-gray-100"
                          ></div>

                          {/* NFT 内容 */}
                          <div className="flex gap-3">
                            {/* NFT 图片 */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={courseMetadata[course.web2CourseId]?.image}
                                alt="NFT"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* NFT 信息 */}
                            <div className="flex-1">
                              <div className="font-medium text-blue-600 mb-1">
                                🎉 课程完成认证 NFT
                              </div>
                              <div className="text-gray-600 mb-1 line-clamp-2">
                                恭喜完成 {course.name} 课程！
                              </div>
                              <div className="text-gray-500">
                                #{course.web2CourseId}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Box>
                  <CardContent className="p-3">
                    <Typography
                      variant="h6"
                      className="text-base font-bold mb-1 line-clamp-1"
                    >
                      {course.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-base font-bold mb-1 line-clamp-1"
                    >
                      {courseMetadata[course.web2CourseId]?.description}
                    </Typography>

                    {!course.purchased && (
                      <Box className="mt-2">
                        {currentStep === "approve" && (
                          <div className="text-center">
                            <CircularProgress size={20} className="mb-2" />
                            <Typography className="text-xs text-gray-600">
                              正在授权代币使用权限...
                            </Typography>
                          </div>
                        )}
                        {currentStep === "purchase" && (
                          <div className="text-center">
                            <CircularProgress size={20} className="mb-2" />
                            <Typography className="text-xs text-gray-600">
                              正在购买课程...
                            </Typography>
                          </div>
                        )}
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
