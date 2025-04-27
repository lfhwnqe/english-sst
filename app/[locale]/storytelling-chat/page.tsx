"use client";

import StaticAppHeader from "@/app/components/common/header/staticAppHeader";
import { Box, Container, Paper, Typography, TextField, Button, CircularProgress, Avatar, Divider, Tabs, Tab } from "@mui/material";
import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// 定义标签页接口
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 标签页内容组件
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 获取标签属性
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function StorytellingChatPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [topic, setTopic] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 使用AI SDK的useChat钩子
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/storytelling',
    id: 'storytelling',
    onFinish: () => {
      console.log('聊天完成');
    },
    onError: (error: Error) => {
      console.error('聊天错误:', error);
    }
  });

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 开始故事会话
  const startStorySession = () => {
    if (!topic.trim()) return;
    setIsReady(true);
  };
  
  // 当isReady变为true时发送第一条消息
  useEffect(() => {
    if (isReady && messages.length === 0) {
      const form = document.getElementById('storytelling-form') as HTMLFormElement;
      if (form) {
        // 设置输入框的值为预设提示
        const initialPrompt = `请讲一个关于${topic}的故事`;
        const inputField = form.querySelector('textarea');
        if (inputField) {
          inputField.value = initialPrompt;
          // 提交表单
          setTimeout(() => {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }, 100);
        }
      }
    }
  }, [isReady, messages.length, topic]);

  return (
    <Box className="relative min-h-screen">
      <StaticAppHeader />
      <Container className="py-8">
        <Paper elevation={3} className="p-6">
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            AI 智能助手测试平台
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="测试类型标签页">
              <Tab label="故事生成" {...a11yProps(0)} />
              <Tab label="RAG检索增强" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {!isReady ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  请输入故事主题或角色，我们将为您创建一个有趣的故事
                </Typography>
                <TextField
                  fullWidth
                  label="故事主题"
                  placeholder="例如：勇敢的小兔子、会飞的小猫..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={startStorySession}
                    disabled={!topic.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    开始创作故事
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box 
                  sx={{ 
                    height: '400px', 
                    overflowY: 'auto', 
                    p: 2, 
                    mb: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  {messages.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        开始与AI助手聊天，探索&ldquo;{topic}&rdquo;的故事
                      </Typography>
                    </Box>
                  )}
                  
                  {messages.map((message) => (
                    <Box 
                      key={message.id} 
                      sx={{ 
                        display: 'flex', 
                        mb: 2,
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                          mr: message.role === 'user' ? 0 : 1,
                          ml: message.role === 'user' ? 1 : 0
                        }}
                      >
                        {message.role === 'user' ? '你' : 'AI'}
                      </Avatar>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          maxWidth: '70%',
                          bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                          color: message.role === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {message.content}
                      </Paper>
                    </Box>
                  ))}
                  
                  {isLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        AI正在思考...
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <form id="storytelling-form" onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder={messages.length === 0 ? `请讲一个关于${topic}的故事...` : "继续故事情节或提出问题..."}
                      value={input}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      multiline
                      rows={2}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading || !input.trim()}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      发送
                    </Button>
                  </Box>
                </form>
              </>
            )}
            
            <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                本页面使用AI SDK与后端Storytelling Agent交互
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                RAG（检索增强生成）是一种先进的AI技术，它结合了信息检索和文本生成功能，可以基于知识库为您提供更精确的回答。
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="/rag-test"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  打开RAG测试工具
                </Button>
                
                <Button
                  variant="outlined"
                  component="a"
                  href="https://github.com/mastralab/mastra"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  了解Mastra框架
                </Button>
              </Box>
              
              <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  RAG功能介绍
                </Typography>
                <Typography variant="body2" component="ul" sx={{ ml: 2 }}>
                  <li>上传文档到知识库</li>
                  <li>基于知识库内容进行搜索</li>
                  <li>删除知识库中的文档</li>
                  <li>结合AI大模型生成更准确的回答</li>
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  本项目使用Amazon Bedrock提供文档向量化能力，Upstash Vector存储向量数据，通过Mastra框架集成到后端。
                </Typography>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
} 