import { fetchStreamResponse } from '@/utils/stream-utils';

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
    
    // 获取cookie
    const cookie = req.headers.get('cookie');
    const headers: HeadersInit = {};
    
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log('Sending to backend:', { prompt: promptContent });

    // 使用工具函数发送请求并处理流式响应
    return fetchStreamResponse(
      url, 
      { prompt: promptContent }, 
      { headers }
    );
    
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