"use client";

import { useState, useRef, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useTransaction,
  useReadContract,
} from "wagmi";
import { CourseMarket__factory } from "@/abi/typechain-types";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from "@mui/material";
import { courseMarketAddressAtom } from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import AnimatedBackground from "@/app/components/web3/ParticleBackground";
import { useTranslations } from "next-intl";
// 课程表单类型
interface CourseForm {
  web2CourseId: string;
  name: string;
  price: string;
  metadataURI: string;
  videoURI: string;
}

export default function AddCoursePage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const t = useTranslations("AddCourse");
  const [formData, setFormData] = useState<CourseForm>({
    web2CourseId: "",
    name: "",
    price: "",
    metadataURI: "",
    videoURI: "",
  });
  const [hash] = useState<string>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const containerRef = useRef<HTMLDivElement>(null);

  // 检查当前账户是否是合约的 owner
  const { data: contractOwner } = useReadContract({
    address: courseMarketAddress as `0x${string}`,
    abi: CourseMarket__factory.abi,
    functionName: "owner",
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrolled = window.scrollY;
      containerRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 等待交易确认
  const { isLoading: isConfirming } = useTransaction({
    hash: hash as `0x${string}` | undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      showMessage(t("status.connectWallet"), "error");
      return;
    }

    // 检查是否是合约 owner
    if (contractOwner !== address) {
      showMessage(t("status.onlyOwner"), "error");
      return;
    }

    try {
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        showMessage(t("status.invalidPrice"), "error");
        return;
      }

      // 验证所有字段都不为空
      if (!formData.web2CourseId || !formData.name || !formData.metadataURI || !formData.videoURI) {
        showMessage(t("status.fillAllFields"), "error");
        return;
      }

      await writeContract({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "addCourse",
        args: [
          formData.web2CourseId,
          formData.name,
          BigInt(Math.floor(price)),
          formData.metadataURI,
          formData.videoURI,
        ],
      });
      showMessage(t("status.purchaseSuccess"), "success");
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Course already exists")) {
        showMessage(t("status.courseIdExists"), "error");
      } else {
        showMessage(t("status.addCourseFailed"), "error");
      }
    }
  };

  const isLoading = isWritePending || isConfirming;

  return (
    <Box className="relative min-h-screen">
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-blue-900">
        <div ref={containerRef} className="w-full h-full">
          <AnimatedBackground />
        </div>
      </div>

      {/* 内容 */}
      <div className="relative">
        <StaticAppHeader />
        <Box className="max-w-2xl mx-auto p-6">
          <Paper elevation={3} className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <Typography variant="h4" className="mb-8 font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {t("title")}
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                label={t("web2CourseIdLabel")}
                name="web2CourseId"
                value={formData.web2CourseId}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder={t("web2CourseIdPlaceholder")}
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label={t("nameLabel")}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder={t("namePlaceholder")}
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label={t("priceLabel")}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.1 }}
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder={t("pricePlaceholder")}
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label={t("metadataURI")}
                name="metadataURI"
                value={formData.metadataURI}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder={t("metadataURIPlaceholder")}
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label={t("videoURI")}
                name="videoURI"
                value={formData.videoURI}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder={t("videoURIPlaceholder")}
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                className="h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-500 disabled:to-gray-600"
              >
                {isLoading ? (
                  <CircularProgress size={24} className="text-white" />
                ) : (
                  t("addCourse")
                )}
              </Button>
            </form>
          </Paper>

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
      </div>
    </Box>
  );
}
