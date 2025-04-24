/**
 * 流式传输处理工具函数
 * 用于处理从后端获取的流式数据并转换为前端可用的格式
 */

/**
 * 处理流式响应，将SSE格式数据转换为JSON格式
 * @param backendResponse 后端API的响应对象
 * @returns 包含流式数据的Response对象
 */
export async function handleStreamResponse(backendResponse: Response): Promise<Response> {
  // 如果响应状态不正常，返回错误信息
  if (!backendResponse.ok) {
    const errorText = await backendResponse.text();
    console.error('Backend error response:', errorText);
    
    return new Response(
      JSON.stringify({
        error: `Server responded with ${backendResponse.status}: ${backendResponse.statusText}`,
        details: errorText
      }),
      {
        status: backendResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 创建一个TransformStream转换流式数据
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  
  // 确保有响应体
  if (!backendResponse.body) {
    const errorMsg = "无法读取后端响应流";
    console.error(errorMsg);
    
    await writer.write(encoder.encode(JSON.stringify({ error: errorMsg }) + '\n'));
    await writer.close();
    
    return new Response(readable, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 处理后端的流式响应
  const reader = backendResponse.body.getReader();
  
  // 异步处理流数据
  (async () => {
    try {
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // 如果还有未处理的内容，处理它
          if (buffer.trim()) {
            await processBuffer(buffer, writer, encoder);
          }
          
          // 发送完成信号
          await writer.write(encoder.encode(JSON.stringify({ done: true }) + '\n'));
          await writer.close();
          break;
        }
        
        // 解码二进制数据
        const text = decoder.decode(value, { stream: true });
        console.log('收到原始数据:', text);
        buffer += text;
        
        // 处理数据
        if (buffer.includes('data:')) {
          // SSE格式处理
          await processSSEFormat(buffer, writer, encoder);
          buffer = ''; // 已处理的内容清空缓冲区
        } else {
          // 非SSE格式，按行分割文本块
          await processPlainTextFormat(buffer, writer, encoder);
          buffer = ''; // 清空缓冲区，保留最后可能不完整的一行
        }
      }
    } catch (e) {
      console.error('处理流数据出错:', e);
      
      try {
        await writer.write(encoder.encode(JSON.stringify({ 
          error: e instanceof Error ? e.message : String(e) 
        }) + '\n'));
        writer.abort(e instanceof Error ? e : new Error(String(e)));
      } catch (writeError) {
        console.error('写入错误信息失败:', writeError);
      }
    }
  })();

  // 返回流式响应
  return new Response(readable, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

/**
 * 处理SSE格式的数据块
 */
async function processSSEFormat(
  buffer: string, 
  writer: WritableStreamDefaultWriter<Uint8Array>,
  encoder: TextEncoder
): Promise<void> {
  const parts = buffer.split('data:');
  
  for (let i = 1; i < parts.length; i++) {
    try {
      const part = parts[i].trim();
      if (!part) continue;
      
      // 找到每条消息的结束位置
      const endPos = part.indexOf('\n\n');
      const jsonStr = endPos >= 0 ? part.substring(0, endPos) : part;
      
      // 解析JSON
      if (jsonStr) {
        const jsonData = JSON.parse(jsonStr);
        if (jsonData.content) {
          await writer.write(encoder.encode(JSON.stringify({ text: jsonData.content }) + '\n'));
        }
      }
    } catch (e) {
      console.error('解析SSE数据出错:', e, parts[i]);
    }
  }
}

/**
 * 处理纯文本格式的数据块
 */
async function processPlainTextFormat(
  buffer: string, 
  writer: WritableStreamDefaultWriter<Uint8Array>,
  encoder: TextEncoder
): Promise<void> {
  const lines = buffer.split(/\r?\n/);
  const lastLine = lines.pop() || ''; // 最后一行可能不完整
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      await writer.write(encoder.encode(JSON.stringify({ text: line.trim() }) + '\n'));
    } catch (e) {
      console.error('写入文本数据出错:', e);
    }
  }
  
  // 处理最后一行（如果完整）
  if (lastLine.trim()) {
    try {
      await writer.write(encoder.encode(JSON.stringify({ text: lastLine.trim() }) + '\n'));
    } catch (e) {
      console.error('写入最后一行文本出错:', e);
    }
  }
}

/**
 * 处理单个数据缓冲区
 */
async function processBuffer(
  buffer: string, 
  writer: WritableStreamDefaultWriter<Uint8Array>,
  encoder: TextEncoder
): Promise<void> {
  try {
    if (buffer.includes('data:')) {
      // 尝试解析SSE格式
      const matches = buffer.match(/data: (.*)/);
      if (matches && matches[1]) {
        const jsonData = JSON.parse(matches[1].trim());
        if (jsonData.content) {
          await writer.write(encoder.encode(JSON.stringify({ text: jsonData.content }) + '\n'));
        }
      }
    } else {
      // 非SSE格式，直接作为文本
      await writer.write(encoder.encode(JSON.stringify({ text: buffer.trim() }) + '\n'));
    }
  } catch (e) {
    console.error('处理数据块错误:', e);
  }
}

/**
 * 包装后端API请求并处理流式响应
 * @param apiEndpoint 后端API端点
 * @param requestData 请求数据
 * @param options 额外的选项
 * @returns 包含流式数据的Response对象
 */
export async function fetchStreamResponse(
  apiEndpoint: string, 
  requestData: Record<string, unknown>, 
  options: {
    headers?: HeadersInit,
    method?: string
  } = {}
): Promise<Response> {
  try {
    // 设置请求头
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
    }
    
    // 发送请求
    const backendResponse = await fetch(apiEndpoint, {
      method: options.method || 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    
    // 处理流式响应
    return handleStreamResponse(backendResponse);
  } catch (error) {
    console.error('API request error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal error while fetching stream',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 