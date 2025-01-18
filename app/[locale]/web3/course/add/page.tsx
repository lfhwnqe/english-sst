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
      showMessage("请先连接钱包", "error");
      return;
    }

    // 检查是否是合约 owner
    if (contractOwner !== address) {
      showMessage("只有合约所有者才能添加课程", "error");
      return;
    }

    try {
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        showMessage("请输入有效的价格", "error");
        return;
      }

      // 验证所有字段都不为空
      if (!formData.web2CourseId || !formData.name || !formData.metadataURI || !formData.videoURI) {
        showMessage("请填写所有必填字段", "error");
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
      showMessage("交易已发送", "success");
    } catch (error) {
      console.error("添加课程错误:", error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Course already exists")) {
        showMessage("课程 ID 已存在，请使用其他 ID", "error");
      } else {
        showMessage("添加课程失败，请检查输入是否正确", "error");
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
              添加新课程
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="Web2 课程 ID"
                name="web2CourseId"
                value={formData.web2CourseId}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder="请输入 Web2 平台的课程 ID"
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label="课程名称"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder="请输入课程名称"
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label="课程价格 (MMC)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.1 }}
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder="请输入课程价格"
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label="元数据 URI"
                name="metadataURI"
                value={formData.metadataURI}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder="请输入课程元数据 URI"
                InputProps={{
                  className: "text-white",
                }}
                InputLabelProps={{
                  className: "text-gray-400",
                }}
              />

              <TextField
                fullWidth
                label="视频 URI"
                name="videoURI"
                value={formData.videoURI}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="bg-white/5"
                disabled={isLoading}
                placeholder="请输入课程视频 URI"
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
                  "添加课程"
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
