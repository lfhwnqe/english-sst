"use client";

import { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Paper, Grid, Card, CardMedia, CardContent, IconButton, Chip, LinearProgress, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { uploadFile } from '@/utils/upload';
import StaticAppHeader from "@/app/components/web3/header/staticAppHeader";
import GradientButton from "@/app/components/common/GradientButton";

interface UploadedImage {
  fileName: string;
  url: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ImageUploadPage() {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
 const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // 鉴权逻辑：检查用户是否已经登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        const response = await fetch('/api/auth/user-info');
        
        if (response.ok) {
          const data = await response.json();
          console.log('User authenticated:', data);
          setIsAuthenticated(true);
        } else {
          console.log('User not authenticated, redirecting to login page');
          // 保存当前URL，以便登录后重定向回来
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            window.localStorage.setItem('redirectAfterLogin', currentPath);
            // 使用window.location.href进行跳转，而不是router.push
            window.location.href = '/auth/login';
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('鉴权检查失败');
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);
  // 清除复制状态的计时器
  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  const validateFile = (file: File) => {
    // 检查文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error(`不支持的文件类型: ${file.name}`);
    }

    // 检查文件大小（例如：限制为 5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`文件过大: ${file.name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;
    
    // 验证所有文件
    try {
      selectedFiles.forEach(validateFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "文件验证失败");
      return;
    }

    // 创建预览
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...selectedFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setPreviews(prev => {
      const newPreviews = [...prev];
      // 释放预览URL
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("请选择至少一张图片");
      return;
    }

    if (!cloudfrontDomain) {
      setError("系统配置错误：CloudFront 域名未配置");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // 初始化上传进度
    const initialProgress = files.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'pending' as const
    }));
    setUploadProgress(initialProgress);

    try {
      const results: UploadedImage[] = [];
      
      // 批量上传所有图片，但一次只上传3个
      const batchSize = 3;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const batchPromises = batch.map(async (file, batchIndex) => {
          const fileIndex = i + batchIndex;
          
          try {
            // 更新状态为上传中
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[fileIndex] = {
                ...newProgress[fileIndex],
                status: 'uploading',
                progress: 10
              };
              return newProgress;
            });
            
            // 上传文件
            const imageKey = await uploadFile(file);
            
            // 更新进度到50%
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[fileIndex] = {
                ...newProgress[fileIndex],
                progress: 50
              };
              return newProgress;
            });
            
            // 构建URL
            const url = `https://${cloudfrontDomain}/${imageKey}`;
            
            // 更新进度到100%
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[fileIndex] = {
                ...newProgress[fileIndex],
                status: 'success',
                progress: 100
              };
              return newProgress;
            });
            
            return {
              fileName: file.name,
              url
            };
          } catch (err) {
            // 更新状态为错误
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[fileIndex] = {
                ...newProgress[fileIndex],
                status: 'error',
                error: err instanceof Error ? err.message : '上传失败'
              };
              return newProgress;
            });
            
            console.error(`Error uploading ${file.name}:`, err);
            throw err;
          }
        });
        
        // 等待当前批次完成
        const batchResults = await Promise.allSettled(batchPromises);
        
        // 收集成功的结果
        batchResults.forEach(result => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }

      // 更新上传成功的图片
      setUploadedImages(prev => [...prev, ...results]);
      
      if (results.length === files.length) {
        setSuccess(`全部 ${files.length} 张图片上传成功！`);
      } else {
        setSuccess(`已上传 ${results.length}/${files.length} 张图片`);
      }
      
      // 清空文件选择
      setFiles([]);
      setPreviews([]);
      setUploadProgress([]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setSuccess("URL已复制到剪贴板");
  };

  return (
    <>
      <StaticAppHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(to right, rgba(229,231,235,0.5), rgba(59,130,246,0.5), rgba(229,231,235,0.5))'
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              background: 'linear-gradient(to right, #3b82f6, #6366f1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            图片上传中心
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <GradientButton onClick={handleBrowseClick} className="px-6 py-2">
                <span className="flex items-center">
                  <CloudUploadIcon sx={{ mr: 1, fontSize: 20 }} />
                  选择图片
                </span>
              </GradientButton>
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                支持的格式: JPG, PNG, GIF, WebP | 最大文件大小: 5MB | 支持批量上传
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                {success}
              </Alert>
            )}
            
            {previews.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 'medium'
                    }}
                  >
                    待上传图片
                  </Typography>
                  <Chip 
                    label={`共 ${previews.length} 张`} 
                    sx={{ 
                      borderRadius: 1,
                      background: 'linear-gradient(to right, #3b82f6, #6366f1)',
                      color: 'white'
                    }}
                    size="small"
                  />
                </Box>
                <Grid container spacing={2}>
                  {previews.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                      <Card 
                        sx={{ 
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          background: 'rgba(255, 255, 255, 0.7)',
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(229,231,235,0.5)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 20px rgba(59,130,246,0.1)',
                            borderColor: 'rgba(59,130,246,0.3)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={preview}
                          alt={`Preview ${index}`}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                              {files[index]?.name}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => removeFile(index)}
                              color="error"
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          {uploadProgress[index] && (
                            <Box sx={{ width: '100%', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={uploadProgress[index].progress} 
                                color={uploadProgress[index].status === 'error' ? 'error' : 'primary'}
                                sx={{ 
                                  height: 4, 
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(229,231,235,0.5)',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(to right, #3b82f6, #6366f1)'
                                  }
                                }}
                              />
                              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                                {uploadProgress[index].status === 'pending' && '等待上传'}
                                {uploadProgress[index].status === 'uploading' && '上传中...'}
                                {uploadProgress[index].status === 'success' && '上传成功'}
                                {uploadProgress[index].status === 'error' && uploadProgress[index].error}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Box sx={{ textAlign: 'center' }}>
              <GradientButton 
                type="submit" 
                disabled={loading || files.length === 0}
                className={`px-8 py-2 ${files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      上传中...
                    </>
                  ) : (
                    `批量上传 ${files.length} 张图片`
                  )}
                </span>
              </GradientButton>
            </Box>
          </form>
        </Paper>
        
        {uploadedImages.length > 0 && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, rgba(229,231,235,0.5), rgba(59,130,246,0.5), rgba(229,231,235,0.5))'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #3b82f6, #6366f1)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                已上传图片
              </Typography>
              <Chip 
                label={`共 ${uploadedImages.length} 张`} 
                sx={{ 
                  borderRadius: 1,
                  background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                  color: 'white'
                }}
              />
            </Box>
            <Grid container spacing={2}>
              {uploadedImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(229,231,235,0.5)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(59,130,246,0.1)',
                        borderColor: 'rgba(59,130,246,0.3)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.url}
                      alt={image.fileName}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="body2" noWrap sx={{ mb: 1 }}>
                        {image.fileName}
                      </Typography>
                      <GradientButton
                        onClick={() => copyToClipboard(image.url, index)}
                        className="w-full py-1 text-xs"
                      >
                        <span className="flex items-center justify-center">
                          {copiedIndex === index ? (
                            <>
                              <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              已复制
                            </>
                          ) : (
                            <>
                              <ContentCopyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              复制链接
                            </>
                          )}
                        </span>
                      </GradientButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
    </>
  );
} 