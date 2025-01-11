"use client";

import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useTransaction } from "wagmi";
import { CourseMarket__factory } from "@/abi/typechain-types";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { courseMarketAddressAtom } from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import { parseEther } from "viem";

// 课程表单类型
interface CourseForm {
  title: string;
  description: string;
  price: string;
  duration: string;
}

export default function AddCoursePage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  useEffect(() => {
    console.log("🌹courseMarket", courseMarketAddress);
  }, [courseMarketAddress]);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const [formData, setFormData] = useState<CourseForm>({
    title: "",
    description: "",
    price: "",
    duration: "",
  });
  const [hash, setHash] = useState<string>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess } = useTransaction({
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

    try {
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        showMessage("请输入有效的价格", "error");
        return;
      }
      const data = {
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "addCourse",
        args: [
          formData.title,
          formData.description,
          parseEther(price.toString()),
        ],
      };
      console.log("🌹data:", data);
      writeContract(data);

      showMessage("交易已发送", "success");
    } catch (error) {
      showMessage("添加课程失败", "error");
      console.error("添加课程错误:", error);
    }
  };

  // 交易成功后重置表单
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        title: "",
        description: "",
        price: "",
        duration: "",
      });
      showMessage("课程添加成功！", "success");
    }
  }, [isSuccess]);

  const isLoading = isWritePending || isConfirming;

  return (
    <Box className="max-w-2xl mx-auto p-6">
      <Typography variant="h4" className="mb-6 font-bold">
        添加新课程
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          fullWidth
          label="课程标题"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          variant="outlined"
          className="bg-white"
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="课程描述"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          multiline
          rows={4}
          variant="outlined"
          className="bg-white"
          disabled={isLoading}
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
          className="bg-white"
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="课程时长 (分钟)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleInputChange}
          required
          inputProps={{ min: 1 }}
          variant="outlined"
          className="bg-white"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          className="h-12 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <CircularProgress size={24} className="text-white" />
          ) : (
            "添加课程"
          )}
        </Button>
      </form>

      {isSuccess && hash && (
        <Alert severity="success" className="mt-6">
          <Typography variant="body1">课程添加成功！</Typography>
          <Typography variant="body2" className="break-all">
            交易哈希: {hash}
          </Typography>
        </Alert>
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
