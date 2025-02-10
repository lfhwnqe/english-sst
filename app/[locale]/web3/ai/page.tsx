"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { Send } from "lucide-react";
import RelativeAppHeader from "@/app/components/web3/header/relativeAppHeader";
import ThemeText from "@/app/components/common/ThemeText";
import { useTranslations } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function AIPage() {
  const t = useTranslations("AIPage");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: 调用 langchain 服务
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      // 显示错误消息
      const errorMessage: Message = {
        role: "assistant",
        content: t("error"),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <RelativeAppHeader />

      <Container maxWidth="md" className="pt-20 pb-24">
        {/* 消息列表 */}
        <div className="space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.timestamp}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                }`}
              >
                <ThemeText
                  className={message.role === "user" ? "text-white" : ""}
                >
                  {message.content}
                </ThemeText>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
          <Container maxWidth="md">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("inputPlaceholder")}
                className="flex-1 max-h-32 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 
                  border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  resize-none overflow-y-auto
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-500 dark:placeholder:text-gray-400"
                rows={1}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700
                  text-white transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </Container>
        </div>
      </Container>
    </Box>
  );
}
