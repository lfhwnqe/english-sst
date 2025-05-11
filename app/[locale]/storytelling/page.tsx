"use client";

import StaticAppHeader from "@/app/components/common/header/staticAppHeader";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";

export default function StorytellingPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/ai/storytelling",
      streamProtocol: "text",
    });
  useEffect(() => {
    console.log("🚀 useChat messages:", messages);
  }, [messages]);

  // 滚动到最新内容
  const storyContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop =
        storyContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box className="relative min-h-screen">
      <StaticAppHeader />
      <Container className="py-8">
        <Paper elevation={3} className="p-6">
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            AI 故事生成
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="请输入故事提示"
              multiline
              rows={3}
              value={input}
              onChange={handleInputChange}
              placeholder="例如：请讲一个关于勇敢小兔子的故事，适合5岁的孩子听"
              disabled={isLoading}
            />
          </Box>

          <Box
            sx={{ mb: 3, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
              disabled={isLoading || !input}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "生成中..." : "生成故事"}
            </Button>
            {isLoading && (
              <Button variant="outlined" color="error" onClick={() => stop()}>
                取消
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              故事内容
            </Typography>

            <Paper
              elevation={1}
              ref={storyContainerRef}
              data-story-content
              sx={{
                p: 3,
                bgcolor: "grey.50",
                maxHeight: "400px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
              }}
            >
              {messages.map((m, idx) => (
                <Typography key={idx} component="p">
                  <strong>{m.role === "user" ? "你:" : "AI:"}</strong>{" "}
                  {m.content}
                </Typography>
              ))}
              {isLoading && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    ml: 1,
                    verticalAlign: "middle",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ animation: "blink 1s infinite", display: "inline" }}
                  >
                    ▏
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              本页面使用后端 AI Storytelling Agent 生成故事
            </Typography>
          </Box>
        </Paper>
      </Container>
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
}
