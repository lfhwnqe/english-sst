"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/utils/fetch";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Tooltip,
} from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { BrainCircuit, Sparkles, Zap, Settings, ArrowRight, HelpCircle } from "lucide-react";

// 创建符合项目主题的暗色MUI主题
const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // blue-500
    },
    secondary: {
      main: '#6366F1', // indigo-500
    },
    background: {
      default: 'rgba(15, 23, 42, 0.8)', // slate-900 with transparency
      paper: 'rgba(30, 41, 59, 0.8)', // slate-800 with transparency
    },
    text: {
      primary: '#F1F5F9', // slate-100
      secondary: '#CBD5E1', // slate-300
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(148, 163, 184, 0.1)', // slate-400 with transparency
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #3B82F6, #6366F1)',
          '&:hover': {
            background: 'linear-gradient(to right, #2563EB, #4F46E5)',
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
        }
      }
    }
  }
}));

// 模型接口
interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  maxTokens: number;
  category: string;
}

export default function AICenter() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "zh-cn";
  const [openRouterTestOpen, setOpenRouterTestOpen] = useState(false);
  const [testPrompt, setTestPrompt] = useState("你好，我想测试你的功能。请用中文回复。");
  const [aiResponse, setAiResponse] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState("");

  // 获取免费模型列表
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      setModelError("");
      try {
        const response = await fetchApi("/api/ai/models");
        if (response.success && response.models) {
          setModels(response.models);
          // 设置默认选择为第一个模型
          if (response.models.length > 0) {
            setSelectedModel(response.models[0].id);
          }
        } else {
          setModelError("获取模型列表失败");
        }
      } catch (error) {
        console.error("获取模型列表错误:", error);
        setModelError("获取模型列表出错");
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const closeOpenRouterTestDialog = () => {
    setOpenRouterTestOpen(false);
  };

  const runOpenRouterTest = async () => {
    setTestLoading(true);
    setAiResponse("");
    
    try {
      const response = await fetchApi("/api/ai/openrouter-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: testPrompt,
            },
          ],
          model: selectedModel,
        }),
      });
      
      if (response.success) {
        setAiResponse(response.content);
      } else {
        setAiResponse(`错误: ${response.message || "未知错误"}`);
      }
    } catch (error) {
      console.error("OpenRouter测试错误:", error);
      setAiResponse(`错误: ${error instanceof Error ? error.message : "未知错误"}`);
    } finally {
      setTestLoading(false);
    }
  };

  const aiFeatures = [
    {
      title: "场景对话",
      description: "创建、管理和参与AI音频场景，体验智能交互",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-500" />,
      path: `/${locale}/web3/audio-scene/list`,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "故事生成",
      description: "使用AI生成有趣的互动故事，适合各年龄段",
      icon: <Sparkles className="w-8 h-8 text-rose-500" />,
      path: `/${locale}/storytelling`,
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "AI故事聊天",
      description: "与AI进行交互式故事创作和对话",
      icon: <BrainCircuit className="w-8 h-8 text-amber-500" />,
      path: `/${locale}/storytelling-chat`,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "RAG知识库测试",
      description: "测试知识库的文档上传、搜索和删除功能",
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      path: `/${locale}/rag-test`,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "OpenRouter 配置测试",
      description: "测试OpenRouter API连接配置是否正常",
      icon: <Settings className="w-8 h-8 text-green-500" />,
      action: () => window.location.href = `/${locale}/web3/openrouter-test`,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "OpenRouter 模型测试",
      description: "测试不同AI模型的响应效果",
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      action: () => setOpenRouterTestOpen(true),
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "更多功能开发中",
      description: "敬请期待更多威科夫AI功能",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      path: "#",
      color: "from-amber-500 to-yellow-500",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground p-0">
      <StaticAppHeader />
      
      {/* 背景装饰 */}
      <div className="absolute top-24 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-24 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            威科夫 AI 中心
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            探索智能语音对话、自然语言处理和生成式AI模型的强大功能
          </p>
        </div>
        
        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {aiFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`
                relative overflow-hidden bg-white/10 dark:bg-gray-800/20 rounded-xl shadow-md hover:shadow-xl 
                backdrop-blur-sm transition-all duration-300 border border-gray-200/20 dark:border-gray-700/30
                ${feature.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] group'}
              `}
              onClick={
                feature.disabled 
                  ? undefined 
                  : feature.action 
                    ? feature.action 
                    : () => router.push(feature.path)
              }
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color}`} />
              <div className="p-6 relative z-10">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-blue-100 dark:to-indigo-200">{feature.title}</h3>
                <p className="text-foreground/70 mb-4">{feature.description}</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 使用ThemeProvider包装Dialog，应用深色主题 */}
      <ThemeProvider theme={darkTheme}>
        <Dialog
          open={openRouterTestOpen}
          onClose={closeOpenRouterTestDialog}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))'
          }}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-100">OpenRouter 模型测试</span>
              {loadingModels && <CircularProgress size={20} />}
            </div>
          </DialogTitle>
          <DialogContent sx={{ padding: '16px', marginTop: '8px' }}>
            <div className="space-y-5 py-2">
              {modelError && (
                <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded border border-red-800/30">
                  {modelError}
                </div>
              )}
              
              <FormControl fullWidth variant="outlined" size="small" sx={{ marginBottom: 2 }}>
                <InputLabel id="model-select-label">选择模型</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  label="选择模型"
                  disabled={loadingModels || models.length === 0}
                >
                  {loadingModels ? (
                    <MenuItem value="" disabled>
                      <em>加载中...</em>
                    </MenuItem>
                  ) : models.length === 0 ? (
                    <MenuItem value="" disabled>
                      <em>没有可用模型</em>
                    </MenuItem>
                  ) : (
                    models.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span>{model.name}</span>
                            <Chip 
                              size="small" 
                              label={model.provider} 
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                              color={
                                model.provider === 'Anthropic' ? 'primary' :
                                model.provider === 'Google' ? 'success' :
                                model.provider === 'Meta' ? 'warning' :
                                model.provider === 'Microsoft' ? 'info' : 'default'
                              }
                            />
                            <Tooltip title={`最大Token数: ${model.maxTokens.toLocaleString()}`}>
                              <span className="ml-2">
                                <HelpCircle size={16} />
                              </span>
                            </Tooltip>
                          </div>
                          <Typography variant="caption" color="text.secondary">
                            {model.description}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              
              <TextField
                label="测试提示"
                multiline
                rows={4}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3B82F6',
                    },
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  },
                }}
              />
              
              <div className="mt-4">
                <Typography variant="subtitle1" gutterBottom>AI 响应:</Typography>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(15, 23, 42, 0.3)',
                    borderRadius: 1, 
                    minHeight: '150px',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {testLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <CircularProgress size={24} />
                    </div>
                  ) : (
                    aiResponse || "等待响应..."
                  )}
                </Box>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ 
            padding: '12px 16px',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))'
          }}>
            <Button onClick={closeOpenRouterTestDialog} variant="text" sx={{ color: '#94A3B8' }}>
              关闭
            </Button>
            <Button 
              onClick={runOpenRouterTest} 
              variant="contained"
              disabled={testLoading || !selectedModel || models.length === 0}
              sx={{
                background: 'linear-gradient(90deg, #3B82F6, #6366F1)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2563EB, #4F46E5)',
                }
              }}
            >
              {testLoading ? "请求中..." : "测试"}
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
} 