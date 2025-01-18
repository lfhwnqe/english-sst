"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useTransaction,
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

// 课程表单类型
interface CourseForm {
  web2CourseId: string; // 修改为合约需要的字段
  name: string;
  price: string;
}

export default function AddCoursePage() {
  const courseMarketAddress = useAtomValue(courseMarketAddressAtom);
  const { isConnected } = useAccount();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const [formData, setFormData] = useState<CourseForm>({
    web2CourseId: "",
    name: "",
    price: "",
  });
  const [hash] = useState<string>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

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

    try {
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        showMessage("请输入有效的价格", "error");
        return;
      }
      await writeContract({
        address: courseMarketAddress as `0x${string}`,
        abi: CourseMarket__factory.abi,
        functionName: "addCourse",
        args: [formData.web2CourseId, formData.name, BigInt(price)],
      });
      showMessage("交易已发送", "success");
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Course already exists")) {
        showMessage("课程 ID 已存在，请使用其他 ID", "error");
      } else {
        showMessage("添加课程失败: " + errorMessage, "error");
      }
      console.error("添加课程错误:", error);
    }
  };

  const isLoading = isWritePending || isConfirming;

  return (
    <Box className="min-h-screen bg-gray-50">
      <StaticAppHeader />
      <Box className="max-w-2xl mx-auto p-6">
        <Paper elevation={3} className="p-6 bg-white rounded-lg">
          <Typography variant="h4" className="mb-6 font-bold text-blue-600">
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
              className="bg-white"
              disabled={isLoading}
              placeholder="请输入 Web2 平台的课程 ID"
            />

            <TextField
              fullWidth
              label="课程名称"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
              className="bg-white"
              disabled={isLoading}
              placeholder="请输入课程名称"
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
              placeholder="请输入课程价格"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              className="h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
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
    </Box>
  );
}
