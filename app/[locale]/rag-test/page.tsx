'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useToast } from '@/app/components/ui/use-toast';

interface SearchResult {
  content: string;
  metadata: {
    id?: string;
    [key: string]: unknown;
  };
  score: number;
}

export default function RagTestPage() {
  const { toast } = useToast();
  
  // 文档上传状态
  const [documentText, setDocumentText] = useState('');
  const [documentId, setDocumentId] = useState(`doc-${Date.now()}`);
  const [uploading, setUploading] = useState(false);
  
  // 搜索状态
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  
  // 删除状态
  const [deleteId, setDeleteId] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  // 上传文档
  const handleUpload = async () => {
    if (!documentText.trim()) {
      toast({
        title: '错误',
        description: '文档内容不能为空',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setUploading(true);
      
      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: documentText,
          metadata: {
            id: documentId,
            source: 'rag-test',
            timestamp: new Date().toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: '成功',
          description: result.message,
        });
        setDocumentText(''); // 清空文档内容
        setDocumentId(`doc-${Date.now()}`); // 重置ID
      } else {
        toast({
          title: '失败',
          description: result.message || '上传文档失败',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('上传文档出错:', error);
      toast({
        title: '错误',
        description: '上传文档发生错误',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  // 搜索文档
  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: '错误',
        description: '搜索查询不能为空',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSearching(true);
      
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          limit: 5,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.results);
        if (result.results.length === 0) {
          toast({
            title: '提示',
            description: '没有找到相关结果',
          });
        }
      } else {
        toast({
          title: '失败',
          description: result.message || '搜索失败',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('搜索出错:', error);
      toast({
        title: '错误',
        description: '搜索发生错误',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };
  
  // 删除文档
  const handleDelete = async () => {
    if (!deleteId.trim()) {
      toast({
        title: '错误',
        description: '文档ID不能为空',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setDeleting(true);
      
      const response = await fetch(`/api/rag/delete?id=${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      toast({
        title: result.success ? '成功' : '失败',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      
      if (result.success) {
        setDeleteId(''); // 清空ID
      }
    } catch (error) {
      console.error('删除文档出错:', error);
      toast({
        title: '错误',
        description: '删除文档发生错误',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">RAG 测试工具</h1>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upload">上传文档</TabsTrigger>
          <TabsTrigger value="search">搜索测试</TabsTrigger>
          <TabsTrigger value="delete">删除文档</TabsTrigger>
        </TabsList>
        
        {/* 上传文档 */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>上传文档到知识库</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">文档ID</label>
                  <Input
                    value={documentId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocumentId(e.target.value)}
                    placeholder="输入文档唯一标识符"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">文档内容</label>
                  <Textarea
                    value={documentText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDocumentText(e.target.value)}
                    placeholder="输入要存储的文档内容"
                    className="min-h-[200px]"
                  />
                </div>
                
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !documentText.trim()}
                  className="w-full"
                >
                  {uploading ? '正在上传...' : '上传文档'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 搜索测试 */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>知识库搜索测试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    placeholder="输入搜索查询"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={searching || !query.trim()}
                  >
                    {searching ? '搜索中...' : '搜索'}
                  </Button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">搜索结果</h3>
                    {searchResults.map((result, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              相似度: {(result.score * 100).toFixed(2)}%
                            </span>
                            {result.metadata?.id && (
                              <span className="text-xs text-gray-500">
                                ID: {result.metadata.id}
                              </span>
                            )}
                          </div>
                          <p className="whitespace-pre-wrap text-sm">{result.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 删除文档 */}
        <TabsContent value="delete">
          <Card>
            <CardHeader>
              <CardTitle>从知识库删除文档</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">文档ID</label>
                  <Input
                    value={deleteId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteId(e.target.value)}
                    placeholder="输入要删除的文档ID"
                  />
                </div>
                
                <Button
                  onClick={handleDelete}
                  disabled={deleting || !deleteId.trim()}
                  variant="destructive"
                  className="w-full"
                >
                  {deleting ? '正在删除...' : '删除文档'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 