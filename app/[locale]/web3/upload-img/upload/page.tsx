"use client";

import { useState, useEffect } from "react";
import { uploadFile } from "@/utils/upload";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import StaticAppHeader from "@/app/components/common/header/staticAppHeader";
import { X } from "lucide-react";

interface UploadedImage {
  fileName: string;
  url: string;
}

export default function UploadImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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
    
    // 验证所有文件
    try {
      selectedFiles.forEach(validateFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "文件验证失败");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    
    // 生成预览URL
    selectedFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => [...prev, previewUrl]);
    });

    setError(null);
    setSuccess(null);
  };

  const removeFile = (index: number) => {
    // 释放预览URL
    URL.revokeObjectURL(previews[index]);
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("请选择至少一张图片");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 并行上传所有图片
      const uploadPromises = files.map(async (file) => {
        const imageKey = await uploadFile(file);
        // 使用 CloudFront 域名构建 URL
        const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
        if (!cloudfrontDomain) {
          throw new Error("CloudFront 域名未配置");
        }
        return {
          fileName: file.name,
          url: `https://${cloudfrontDomain}/${imageKey}`
        };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedImages(results);
      setSuccess("图片上传成功！");
      setFiles([]);
      setPreviews([]);

      // 清空文件选择
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <StaticAppHeader />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">上传图片</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 图片上传区域 */}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
              multiple
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer block text-center text-foreground/70 hover:text-foreground transition-colors"
            >
              点击选择图片文件（可多选）<br />
              <span className="text-sm text-gray-500">
                支持 JPG、PNG、GIF、WebP 格式，单个文件最大 5MB
              </span>
            </label>

            {/* 图片预览区域 */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || files.length === 0}
            className={`w-full py-2 px-4 rounded transition-colors ${
              loading || files.length === 0
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20"
            }`}
          >
            {loading ? "上传中..." : "上传图片"}
          </button>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">{success}</div>}

          {/* 显示上传成功的图片URL */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">上传成功的图片链接：</h2>
              <div className="space-y-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded">
                    <p className="font-medium mb-1">{image.fileName}</p>
                    <a 
                      href={image.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 break-all"
                    >
                      {image.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}
