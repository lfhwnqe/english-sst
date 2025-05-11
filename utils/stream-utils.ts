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
  
  // 检查响应是否为Lambda Function URL格式
  const contentType = backendResponse.headers.get('Content-Type');
  
  // 检查是否可能是Lambda Function URL响应格式
  // 这种格式通常会返回JSON，包含body字段
  if (contentType && contentType.includes('application/json')) {
    try {
      // 读取响应文本
      const responseText = await backendResponse.text();
      console.log('尝试解析可能的Lambda包装响应:', responseText.substring(0, 100) + '...');
      
      // 尝试解析JSON
      const responseData = JSON.parse(responseText);
      
      // 检查是否为Lambda Function URL响应格式
      if (responseData && 
          responseData.statusCode && 
          responseData.body && 
          typeof responseData.body === 'string' &&
          responseData.body.includes('data:')) {
        
        console.log('检测到Lambda Function URL响应格式，提取SSE流数据');
        
        // 创建一个新的流来处理解包后的SSE数据
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        
        // 异步处理SSE数据
        (async () => {
          try {
            const encoder = new TextEncoder();
            // 提取body中的SSE数据
            const sseData = responseData.body;
            console.log('SSE数据长度:', sseData.length);
            console.log('SSE数据前100字符:', sseData.substring(0, 100));
            
            // 直接写入完整的SSE数据
            // 这样前端可以按原始SSE格式处理
            await writer.write(encoder.encode(sseData));
            await writer.close();
          } catch (error) {
            console.error('处理Lambda SSE数据出错:', error);
            writer.abort(error instanceof Error ? error : new Error(String(error)));
          }
        })();
        
        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        });
      }
      
      // 不是我们期望的Lambda格式，创建一个新的Response对象
      return new Response(responseText, {
        status: backendResponse.status,
        headers: {
          'Content-Type': contentType,
        }
      });
    } catch (error) {
      console.error('解析Lambda响应失败:', error);
      // 如果解析失败，继续使用原始响应
    }
  }
  
  // 如果是Lambda格式但已经是text/event-stream，直接转发响应体
  if (contentType && contentType.includes('text/event-stream')) {
    // 创建一个TransformStream用于传递数据
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    
    // 确保有响应体
    if (!backendResponse.body) {
      const errorMsg = "无法读取后端响应流";
      console.error(errorMsg);
      await writer.write(new TextEncoder().encode(JSON.stringify({ error: errorMsg }) + '\n'));
      await writer.close();
      return new Response(readable, { headers: { 'Content-Type': 'application/json' } });
    }
    
    // 使用读取和写入的方式替代直接pipeTo，避免锁定错误
    const reader = backendResponse.body.getReader();
    
    // 异步处理流数据
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            await writer.close();
            break;
          }
          
          // 将数据原样写入新流
          await writer.write(value);
        }
      } catch (error) {
        console.error('流传输出错:', error);
        try {
          writer.abort(error instanceof Error ? error : new Error(String(error)));
        } catch (abortError) {
          console.error('中止流失败:', abortError);
        }
      }
    })();
    
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
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
  // 按SSE格式规范分割数据块
  // 每个SSE消息以"data:"开头，以"\n\n"结尾
  const lines = buffer.split('\n\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      // 检查是否包含data:前缀
      const dataMatch = line.match(/data:\s*(.*)/);
      if (dataMatch && dataMatch[1]) {
        const jsonStr = dataMatch[1].trim();
        console.log('解析SSE数据:', jsonStr);
        
        // 解析JSON
        try {
          const jsonData = JSON.parse(jsonStr);
          
          // 检查内容字段，支持content或text
          if (jsonData.content) {
            console.log('获取到内容:', jsonData.content);
            await writer.write(encoder.encode(JSON.stringify({ text: jsonData.content }) + '\n'));
          } else if (jsonData.text) {
            console.log('获取到文本:', jsonData.text);
            await writer.write(encoder.encode(JSON.stringify({ text: jsonData.text }) + '\n'));
          } else if (jsonData.done) {
            console.log('获取到结束标记');
            await writer.write(encoder.encode(JSON.stringify({ done: true }) + '\n'));
          } else if (jsonData.error) {
            console.error('获取到错误:', jsonData.error);
            await writer.write(encoder.encode(JSON.stringify({ error: jsonData.error }) + '\n'));
          }
        } catch (jsonError) {
          console.error('JSON解析错误:', jsonError, '数据:', jsonStr);
        }
      } else {
        console.log('跳过非SSE格式数据:', line);
      }
    } catch (e) {
      console.error('处理SSE数据块出错:', e);
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