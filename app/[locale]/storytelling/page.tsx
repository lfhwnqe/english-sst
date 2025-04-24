"use client";

import StaticAppHeader from "@/app/components/common/header/staticAppHeader";
import { Box, Container, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function StorytellingPage() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const storyContainerRef = useRef<HTMLDivElement | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("请输入故事提示");
      return;
    }

    // 重置状态
    setStory("");
    setError("");
    setIsLoading(true);

    // 创建新的AbortController，用于中断流式传输
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // 向后端API发送请求
      const response = await fetch("/api/ai/storytelling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应流");
      }

      // 从流中读取数据
      const decoder = new TextDecoder();
      let done = false;
      let receivedData = false; // 添加一个变量追踪是否接收到任何数据
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (done) break;

        // 解析二进制数据为文本
        const chunk = decoder.decode(value, { stream: true });
        console.log("收到原始数据块:", chunk);
        
        // 将新数据添加到缓冲区
        buffer += chunk;
        
        // 按换行符分割，处理可能包含多个JSON对象的情况
        const lines = buffer.split('\n');
        // 保留最后一行（可能不完整）到buffer
        buffer = lines.pop() || "";
        
        // 处理每一行完整的JSON
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            // 解析JSON对象
            const data = JSON.parse(line);
            console.log("解析的JSON数据:", data);
            
            if (data.done) {
              // 故事讲述完成
              console.log("故事接收完成");
            } else if (data.error) {
              // 接收到错误
              setError(data.error);
            } else if (data.text) {
              // 接收到故事内容
              console.log("接收到文本:", data.text);
              setStory(prev => prev + data.text);
              receivedData = true;
            }
          } catch (jsonError) {
            console.error("JSON解析错误:", jsonError, "行内容:", line);
          }
        }
      }
      
      // 处理buffer中可能剩余的最后一个数据
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          if (data.text) {
            setStory(prev => prev + data.text);
            receivedData = true;
          }
        } catch (e) {
          console.error("处理最后数据出错:", e);
        }
      }
      
      if (!receivedData) {
        console.warn("完成流读取但未收到任何故事内容");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (err.name !== "AbortError") {
        console.error("流式传输错误:", err);
        setError(err.message || "获取故事时出错");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // 自动滚动到最新内容
  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
    }
  }, [story]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // 组件卸载时中断请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
              value={prompt}
              onChange={handlePromptChange}
              placeholder="例如：请讲一个关于勇敢小兔子的故事，适合5岁的孩子听"
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ mb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? "生成中..." : "生成故事"}
            </Button>
            
            {isLoading && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
              >
                取消
              </Button>
            )}
          </Box>

          {error && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "error.main", borderRadius: 1 }}>
              <Typography sx={{ color: "white" }}>{error}</Typography>
            </Box>
          )}

          {story && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                故事内容
              </Typography>
              
              <Paper 
                elevation={1} 
                ref={storyContainerRef}
                sx={{ 
                  p: 3,
                  bgcolor: "grey.50", 
                  maxHeight: "400px", 
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8
                }}
              >
                {story}
                {isLoading && (
                  <Box component="span" sx={{ display: "inline-block", ml: 1, verticalAlign: "middle" }}>
                    <Typography component="span" sx={{ animation: "blink 1s infinite", display: "inline" }}>
                      ▏
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
              本页面使用后端 AI Storytelling Agent 生成故事
            </Typography>
          </Box>
        </Paper>
      </Container>
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
} 