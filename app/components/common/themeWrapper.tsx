'use client'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

// 创建自定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: "#0A0A0A", // 设置主色（替换为你需要的颜色）
    },
    secondary: {
      main: "#dc004e", // 设置次色
    },
    background: {
      default: "#0A0A0A", // 全局背景色
    },
    text: {
      primary: "#f0f0f0", // 主文本颜色
    },
  },
});

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
