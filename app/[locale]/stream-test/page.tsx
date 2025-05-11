"use client";

import { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Button, Paper, Divider, 
  Stack, Chip, CircularProgress, Alert 
} from '@mui/material';
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";

export default function StreamTestPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'streaming' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // 使用 Next.js API 路由而不是直接调用 Lambda URL
  // 这样可以避免 CORS 问题
  const apiUrl = '/api/stream';

  const startStreaming = () => {
    setStatus('connecting');
    setMessages([]);
    setError(null);

    try {
      // 创建 EventSource 连接到我们的 API 路由
      const eventSource = new EventSource(apiUrl);
      
      setStatus('streaming');
      
      // 监听消息
      eventSource.onmessage = (event) => {
        console.log('收到消息:', event.data);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };
      
      // 监听错误
      eventSource.onerror = (err) => {
        console.error('EventSource 错误:', err);
        setError('连接错误或已关闭');
        setStatus('error');
        eventSource.close();
      };
      
      // 监听连接打开
      eventSource.onopen = () => {
        console.log('EventSource 连接已打开');
      };
      
      // 10秒后自动关闭连接
      setTimeout(() => {
        eventSource.close();
        setStatus('completed');
      }, 10000);
    } catch (err) {
      console.error('创建 EventSource 时出错:', err);
      setError(`创建连接时出错: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('error');
    }
  };

  // 状态标签颜色
  const getStatusColor = () => {
    switch (status) {
      case 'streaming': return 'success';
      case 'error': return 'error';
      case 'connecting': return 'warning';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  // 状态显示文本
  const getStatusText = () => {
    switch (status) {
      case 'idle': return '等待开始';
      case 'connecting': return '正在连接...';
      case 'streaming': return '正在接收数据...';
      case 'completed': return '接收完成';
      case 'error': return '连接错误';
    }
  };

  return (
    <>
      <StaticAppHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Lambda 流式响应测试
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              这个页面用于测试 AWS Lambda 的流式响应功能。点击下面的按钮开始测试，将会连接到测试用的 Lambda 函数，并接收流式数据。
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={startStreaming}
              disabled={status === 'streaming' || status === 'connecting'}
              startIcon={status === 'connecting' && <CircularProgress size={20} color="inherit" />}
            >
              {status === 'idle' || status === 'completed' || status === 'error' 
                ? '开始测试流式响应' 
                : status === 'connecting' 
                  ? '正在连接...' 
                  : '正在接收数据...'}
            </Button>
            <Chip 
              label={getStatusText()} 
              color={getStatusColor() as "success" | "error" | "warning" | "info" | "default"} 
              variant="outlined" 
            />
          </Box>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">接收到的消息</Typography>
            </Box>

            {messages.length === 0 && !error ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">尚未收到任何消息</Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {messages.map((message, index) => (
                  <Paper key={index} sx={{ p: 2, bgcolor: index % 2 === 0 ? 'grey.50' : 'white' }}>
                    <Typography variant="body1">{message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                ))}
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            )}
          </Paper>

          <Divider />

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>技术说明</Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
              如何工作：
            </Typography>
            <Typography variant="body2" paragraph>
              这个页面使用了浏览器的 EventSource API 来建立 SSE (Server-Sent Events) 连接，
              这允许服务器向客户端推送消息，而无需客户端频繁轮询。Lambda 函数被配置为使用 RESPONSE_STREAM 模式，
              这使得 Lambda 能够以流式方式发送响应。
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              流式响应格式：
            </Typography>
            <Typography variant="body2" paragraph>
              SSE 规范要求每条消息以 'data:' 开头，以 '\n\n' 结尾。
              Lambda 流式响应需要被正确格式化以符合此规范。
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              用途：
            </Typography>
            <Typography variant="body2" paragraph>
              流式响应对于需要长时间处理的任务非常有用，例如生成式 AI、大型数据处理等，
              因为它允许将部分结果立即发送给客户端，而不必等待整个处理完成。
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
