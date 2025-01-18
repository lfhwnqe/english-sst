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
import { useParams, useRouter } from "next/navigation";
import { Award } from "lucide-react";
import ThemeText from "@/app/components/common/ThemeText";
import { useTranslations } from "next-intl";
import Web3Loading from "../common/Web3Loading";

interface Course {
  web2CourseId: string;
  name: string;
  price: bigint;
  creator: string;
  isActive: boolean;
  purchased: boolean;
  completed: boolean;
  metadataURI: string;
}

interface CourseMetadata {
  name: string;
  description: string;
  image: string;
}

type TransactionStep = "approve" | "purchase" | "none";

interface CourseListProps {
  showPurchaseButton?: boolean;
  onlyPurchased?: boolean;
}

export default function CourseList({
  showPurchaseButton = true,
  onlyPurchased = false,
}: CourseListProps) {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const mmcTokenAddress = useAtomValue(mmcTokenAddressAtom);
  const { address, isConnected } = useAccount();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const t = useTranslations("CourseList");

  const { writeContract } = useWriteContract();
  const params = useParams();
  const locale = (params.locale as string) || "zh-cn";
  const router = useRouter();

  // 读取课程列表
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: onlyPurchased
          ? "getUserPurchasedCourses"
          : "getCoursesByPage",
        args: onlyPurchased
          ? [address as `0x${string}`]
          : [
              address
                ? (address as `0x${string}`)
                : "0x0000000000000000000000000000000000000000",
              BigInt(0),
              BigInt(10),
            ],
      },
    ],
  });

  // 读取代币余额和授权额度
  const { data: tokenData } = useReadContracts({
    contracts:
      address && showPurchaseButton
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
        : [],
  });

  const { courseCount, courses } = useMemo(() => {
    if (data?.[0]?.status === "success") {
      if (onlyPurchased) {
        const [, courseDetails] = data[0].result as [unknown, Course[]];
        return {
          courseCount: courseDetails?.length || 0,
          courses: courseDetails || [],
        };
      } else {
        return {
          courseCount: data[0].result[1],
          courses: data[0].result[0],
        };
      }
    }
    return {
      courseCount: 0,
      courses: [],
    };
  }, [data, onlyPurchased]);

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

  const [currentStep, setCurrentStep] = useState<TransactionStep>("none");

  useWatchContractEvent({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    eventName: "CoursePurchased",
    onLogs(logs) {
      for (const log of logs) {
        if (log.args && typeof log.args === "object" && "buyer" in log.args) {
          const { buyer } = log.args;
          if (buyer === address) {
            showMessage(t("status.purchaseSuccess"), "success");
            setCurrentStep("none");
            refetch();
            break;
          }
        }
      }
    },
  });

  const handleCourseClick = async (course: Course) => {
    if (!showPurchaseButton) return;

    if (!isConnected) {
      showMessage(t("status.connectWallet"), "error");
      return;
    }

    if (course.purchased) {
      router.push(`/${locale}/web3/course/play/${course.web2CourseId}`);
      return;
    }

    if (balance < course.price) {
      showMessage(t("status.insufficientBalance"), "error");
      return;
    }

    try {
      if (allowance < course.price) {
        setCurrentStep("approve");
        try {
          await writeContract({
            address: mmcTokenAddress as `0x${string}`,
            abi: MMCToken__factory.abi,
            functionName: "approve",
            args: [courseMarketAddress as `0x${string}`, course.price],
          });
          showMessage(t("status.authorizationSent"), "success");
        } catch {
          showMessage(t("status.authorizationCanceled"), "error");
          setCurrentStep("none");
        }
        return;
      }

      setCurrentStep("purchase");
      await writeContract({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "purchaseCourse",
        args: [course.web2CourseId],
      });
      showMessage(t("status.purchaseSent"), "success");
    } catch {
      showMessage(t("status.purchaseCanceled"), "error");
      setCurrentStep("none");
    }
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <Web3Loading />
      </Box>
    );
  }

  return (
    <>
      <ThemeText variant="subtitle1" className="mb-4" secondary>
        {t("totalCount", { count: courseCount?.toString() || "0" })}
      </ThemeText>

      <Grid container spacing={3}>
        {(courses as Course[])?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.web2CourseId}>
            <Card
              className={`h-full transition-all duration-300 cursor-pointer relative 
                before:absolute before:inset-0 before:p-[2px] before:rounded-lg before:-z-10
                backdrop-blur-sm
                ${
                  course.completed
                    ? `before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500
                       bg-white/95 dark:bg-gray-800/95
                       shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_15px_rgba(96,165,250,0.2)]
                       hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]
                       scale-[1.02] hover:scale-[1.03]`
                    : course.purchased
                      ? `before:bg-gradient-to-r before:from-emerald-500 before:via-teal-500 before:to-cyan-500
                       bg-white/95 dark:bg-gray-800/95
                       shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_15px_rgba(20,184,166,0.2)]
                       hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]
                       scale-[1.01] hover:scale-[1.02]`
                      : `before:bg-gradient-to-r before:from-rose-600 before:via-fuchsia-600 before:to-indigo-600
                       bg-white/95 dark:bg-gray-800/95
                       shadow-[0_0_15px_rgba(225,29,72,0.3)] dark:shadow-[0_0_15px_rgba(192,38,211,0.2)]
                       hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] dark:hover:shadow-[0_0_20px_rgba(192,38,211,0.4)]
                       hover:scale-[1.02]`
                }
                ring-1 ring-gray-200/50 dark:ring-gray-700/50
                hover:ring-blue-500/30 dark:hover:ring-blue-400/30`}
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

                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={courseMetadata[course.web2CourseId]?.image}
                            alt="NFT"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="font-medium text-blue-600 mb-1">
                            🎉 {t("nft.completed")}
                          </div>
                          <div className="text-gray-600 mb-1 line-clamp-2">
                            {t("nft.congratulations", {
                              courseName: course.name,
                            })}
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
                <ThemeText
                  variant="h6"
                  className="text-base font-bold mb-1 line-clamp-1"
                >
                  {course.name}
                </ThemeText>

                <ThemeText
                  variant="body1"
                  className="mb-1 line-clamp-1"
                  secondary
                >
                  {courseMetadata[course.web2CourseId]?.description}
                </ThemeText>

                {showPurchaseButton && !course.purchased && (
                  <Box className="mt-2">
                    {currentStep === "approve" && (
                      <div className="text-center">
                        <CircularProgress size={20} className="mb-2" />
                        <ThemeText className="text-xs" secondary>
                          {t("status.authorizing")}
                        </ThemeText>
                      </div>
                    )}
                    {currentStep === "purchase" && (
                      <div className="text-center">
                        <CircularProgress size={20} className="mb-2" />
                        <ThemeText className="text-xs" secondary>
                          {t("status.purchasing")}
                        </ThemeText>
                      </div>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
    </>
  );
}
