export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Storytelling Request:', body);

    // 获取正确的prompt参数 - 从messages数组或直接使用prompt参数
    let promptContent = "";
    if (body.messages && body.messages.length > 0) {
      // AI SDK格式，取最后一条用户消息
      promptContent = body.messages[body.messages.length - 1]?.content || "";
    } else if (body.prompt) {
      // 直接提供的prompt参数
      promptContent = body.prompt;
    }

    // 确保有提示内容
    if (!promptContent.trim()) {
      return new Response(
        JSON.stringify({
          error: "请提供故事提示"
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 获取后端API URL
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const url = `${apiUrl}/ai/storytelling`;

    // 设置请求头
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    // 从客户端请求中获取cookie，并在请求后端时带上
    const cookie = req.headers.get('cookie');
    if (cookie) {
      headers.append('Cookie', cookie);
    }

    console.log('Sending to backend:', { prompt: promptContent });

    // 使用fetch直接请求后端API
    const backendResponse = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt: promptContent }),
    });

    // 如果后端返回错误状态，直接返回错误信息
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

    // 创建一个简单的 TransformStream 转换流式数据
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    
    // 处理后端的流式响应
    if (backendResponse.body) {
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
                  console.error('处理最后数据块错误:', e);
                }
              }
              
              // 发送完成
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
              const parts = buffer.split('data:');
              buffer = ''; // 清空缓冲区
              
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
                  
                  // 如果找到了消息结束，将剩余部分保存到buffer
                  if (endPos >= 0) {
                    buffer = part.substring(endPos + 2);
                  }
                } catch (e) {
                  console.error('解析SSE数据出错:', e);
                }
              }
            } else {
              // 非SSE格式，按行分割文本块
              const lines = buffer.split(/\r?\n/);
              buffer = lines.pop() || ''; // 最后一行可能不完整，保留到buffer
              
              for (const line of lines) {
                if (!line.trim()) continue;
                
                try {
                  await writer.write(encoder.encode(JSON.stringify({ text: line.trim() }) + '\n'));
                } catch (e) {
                  console.error('写入文本数据出错:', e);
                }
              }
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
    }

    // 返回流式响应
    return new Response(readable, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 