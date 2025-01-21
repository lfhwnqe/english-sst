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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
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

interface PurchaseDialogProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onConfirm: () => void;
  balance: bigint;
  allowance: bigint;
  courseMetadata: { [key: string]: CourseMetadata };
  locale: string;
  router: ReturnType<typeof useRouter>;
}

function PurchaseDialog({
  open,
  course,
  onClose,
  onConfirm,
  balance,
  allowance,
  courseMetadata,
  locale,
  router,
}: PurchaseDialogProps) {
  const t = useTranslations("CourseList");

  if (!course) return null;

  const hasInsufficientBalance = balance < course.price;
  const needsApproval = allowance < course.price;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className:
          "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50",
      }}
    >
      <DialogTitle className="border-b border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100">
        {t("purchase.confirmTitle")}
      </DialogTitle>
      <DialogContent className="mt-4">
        <div className="flex gap-4 mb-4">
          <img
            src={
              courseMetadata[course.web2CourseId]?.image || "/icon-512x512.png"
            }
            alt={course.name}
            className="w-24 h-24 rounded-lg object-cover border border-gray-200/50 dark:border-gray-700/50"
          />
          <div>
            <Typography
              variant="h6"
              className="mb-1 text-gray-900 dark:text-gray-100"
            >
              {course.name}
            </Typography>
            <Typography
              variant="body2"
              className="mb-2 text-gray-600 dark:text-gray-400"
            >
              {courseMetadata[course.web2CourseId]?.description}
            </Typography>
            <Typography
              variant="subtitle2"
              className="text-blue-500 dark:text-blue-400"
            >
              {course.price.toString()} MMC
            </Typography>
          </div>
        </div>

        {hasInsufficientBalance && (
          <Alert
            severity="error"
            className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50"
          >
            <div className="flex flex-col gap-2">
              <div>{t("purchase.insufficientBalance")}</div>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  router.push(`/${locale}/web3/swap`);
                }}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 self-start"
              >
                {t("purchase.getMMC")}
              </Button>
            </div>
          </Alert>
        )}

        {!hasInsufficientBalance && needsApproval && (
          <Alert
            severity="info"
            className="mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50"
          >
            {t("purchase.needsApproval")}
          </Alert>
        )}

        {!hasInsufficientBalance && !needsApproval && (
          <Alert
            severity="info"
            className="mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50"
          >
            {t("purchase.readyToPurchase")}
          </Alert>
        )}
      </DialogContent>
      <DialogActions className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        <Button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {t("purchase.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={hasInsufficientBalance}
          className={`
            ${
              needsApproval
                ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                : "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            }
            disabled:bg-gray-400 dark:disabled:bg-gray-600
          `}
        >
          {needsApproval ? t("purchase.approve") : t("purchase.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
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

  const { writeContractAsync } = useWriteContract();
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
  const { data: tokenData, refetch: refetchTokenData } = useReadContracts({
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  // 监听购买事件
  useWatchContractEvent({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    eventName: "CoursePurchased",
    onLogs(logs) {
      for (const log of logs) {
        if (
          log.args &&
          typeof log.args === "object" &&
          "buyer" in log.args &&
          "courseId" in log.args
        ) {
          const { buyer, web2CourseId } = log.args;
          // 检查是否是当前选中课程的购买事件
          if (
            buyer === address &&
            currentStep === "purchase" &&
            selectedCourse &&
            web2CourseId === selectedCourse.web2CourseId
          ) {
            showMessage(t("status.purchaseSuccess"), "success");
            setCurrentStep("none");
            setPurchaseDialogOpen(false);
            refetch();
            break;
          }
        }
      }
    },
  });

  // 监听授权事件
  useWatchContractEvent({
    address: mmcTokenAddress as `0x${string}`,
    abi: MMCToken__factory.abi,
    eventName: "Approval",
    onLogs(logs) {
      for (const log of logs) {
        if (
          pendingApproval &&
          log.args &&
          typeof log.args === "object" &&
          "owner" in log.args &&
          "spender" in log.args &&
          log.args.owner === address &&
          log.args.spender === courseMarketAddress
        ) {
          setPendingApproval(false);
          showMessage(t("status.authorizationSuccess"), "success");
          // 授权成功后重新获取授权额度
          refetchTokenData();
          setCurrentStep("none");
          break;
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

    // 直接打开购买确认对话框，不管余额是否足够
    setSelectedCourse(course);
    setPurchaseDialogOpen(true);
  };

  // 处理确认按钮点击
  const handlePurchaseConfirm = async () => {
    if (!selectedCourse) return;

    try {
      // 直接进入购买流程
      setCurrentStep("purchase");
      const result = await writeContractAsync({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "purchaseCourse",
        args: [selectedCourse.web2CourseId],
      });

      if (result) {
        showMessage(t("status.purchaseSent"), "success");
        console.log("Transaction submitted:", result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // 如果是 ERC20InsufficientAllowance 错误，说明需要授权
      if (errorMessage.includes("ERC20InsufficientAllowance")) {
        try {
          setPendingApproval(true);
          setCurrentStep("approve");
          const approveAmount = selectedCourse.price;
          
          const approveResult = await writeContractAsync({
            address: mmcTokenAddress as `0x${string}`,
            abi: MMCToken__factory.abi,
            functionName: "approve",
            args: [courseMarketAddress as `0x${string}`, approveAmount],
          });

          if (approveResult) {
            showMessage(t("status.authorizationSent"), "success");
            console.log("Approval submitted:", approveResult);
          }
        } catch (approveErr) {
          setPendingApproval(false);
          const approveErrorMessage = approveErr instanceof Error ? approveErr.message : String(approveErr);
          if (approveErrorMessage.includes("User rejected the request")) {
            showMessage(t("status.userRejected"), "error");
          } else {
            showMessage(t("status.authorizationCanceled"), "error");
          }
          console.error("Approval failed:", approveErr);
          setCurrentStep("none");
          setPurchaseDialogOpen(false);
          setSelectedCourse(null);
        }
      } else if (errorMessage.includes("User rejected the request")) {
        showMessage(t("status.userRejected"), "error");
        setCurrentStep("none");
        setPurchaseDialogOpen(false);
        setSelectedCourse(null);
      } else {
        showMessage(t("status.purchaseCanceled"), "error");
        console.error("Transaction failed:", err);
        setCurrentStep("none");
        setPurchaseDialogOpen(false);
        setSelectedCourse(null);
      }
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

      <PurchaseDialog
        open={purchaseDialogOpen}
        course={selectedCourse}
        onClose={() => {
          setPurchaseDialogOpen(false);
          setSelectedCourse(null);
          setCurrentStep("none");
        }}
        onConfirm={handlePurchaseConfirm}
        balance={balance}
        allowance={allowance}
        courseMetadata={courseMetadata}
        locale={locale}
        router={router}
      />

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
