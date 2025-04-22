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
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import { BrainCircuit, Sparkles, Zap, Settings, ArrowRight, HelpCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground p-0">
      <StaticAppHeader />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            威科夫 AI 中心
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            探索智能语音对话、自然语言处理和生成式AI模型的强大功能
          </p>
        </div>
        
        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {aiFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`
                relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl 
                transition-all duration-300 border border-gray-200 dark:border-gray-700
                ${feature.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}
              `}
              onClick={
                feature.disabled 
                  ? undefined 
                  : feature.action 
                    ? feature.action 
                    : () => router.push(feature.path)
              }
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color}`} />
              <div className="p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OpenRouter Test Dialog */}
      <Dialog
        open={openRouterTestOpen}
        onClose={closeOpenRouterTestDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div className="flex items-center justify-between">
            <span>OpenRouter 模型测试</span>
            {loadingModels && <CircularProgress size={20} />}
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-4">
            {modelError && (
              <div className="text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {modelError}
              </div>
            )}
            
            <FormControl fullWidth variant="outlined" className="mb-4">
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
                        <Typography variant="caption" color="textSecondary">
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
            />
            
            <div className="mt-4">
              <Typography variant="subtitle1" gutterBottom>AI 响应:</Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1, 
                  minHeight: '150px',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid',
                  borderColor: 'divider'
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
        <DialogActions>
          <Button onClick={closeOpenRouterTestDialog}>关闭</Button>
          <Button 
            onClick={runOpenRouterTest} 
            color="primary" 
            variant="contained"
            disabled={testLoading || !selectedModel || models.length === 0}
          >
            {testLoading ? "请求中..." : "测试"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 