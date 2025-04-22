"use client";

import StaticAppHeader from "@/app/components/common/header/staticAppHeader";
import { Box, Container, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

interface OpenRouterConfigResponse {
  success: boolean;
  message: string;
  data: {
    apiUrlConfigured: boolean;
    apiKeyConfigured: boolean;
    apiKeyLength: number;
    apiUrl: string;
  };
}

export default function OpenRouterTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OpenRouterConfigResponse | null>(null);
  const [error, setError] = useState("");

  const testOpenRouterConfig = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/ai/openrouter-config');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API错误: ${response.status} ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("测试失败:", error);
      setError(error instanceof Error ? error.message : "测试失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 页面加载时自动测试
    testOpenRouterConfig();
  }, []);

  return (
    <Box className="relative min-h-screen">
      <StaticAppHeader />
      <Container className="py-8">
        <Paper elevation={3} className="p-6">
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            OpenRouter 配置测试
          </Typography>

          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={testOpenRouterConfig}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "测试中..." : "重新测试"}
            </Button>
          </Box>

          {error && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "error.main", borderRadius: 1 }}>
              <Typography sx={{ color: "white" }}>{error}</Typography>
            </Box>
          )}

          {result && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                测试结果
              </Typography>
              
              <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100", maxHeight: "300px", overflow: "auto" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Paper>
              
              {result.data && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    配置状态:
                  </Typography>
                  <Box sx={{ pl: 2, borderLeft: "2px solid", borderColor: "primary.main" }}>
                    <Typography>
                      API URL: {result.data.apiUrl || "未配置"}
                    </Typography>
                    <Typography>
                      API Key: {result.data.apiKeyConfigured ? "已配置" : "未配置"} 
                      {result.data.apiKeyLength ? ` (长度: ${result.data.apiKeyLength})` : ""}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
              此页面用于测试后端 OpenRouter 配置是否正确
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
