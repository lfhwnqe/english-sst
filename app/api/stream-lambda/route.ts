import { NextRequest, NextResponse } from 'next/server';

// Monorepo 流式 Lambda 函数 URL
// TODO: 部署后将它替换为实际的 URL
// 部署 CDK 堆栈后，从 CloudFormation 输出中获取 'StreamServiceFunctionUrl' 值
// 执行: yarn deploy:monorepo 并查看输出中的 URL
const STREAM_LAMBDA_URL = 'https://x45pyto42xqvzksz2mp5m4qdvm0lmkqb.lambda-url.us-east-1.on.aws/';

// 这个 API 路由将代理请求到我们的新流式 Lambda 函数
export async function GET(request: NextRequest) {
  try {
    // 创建一个可读流的转换器
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // 发起请求到 Lambda 函数
    const lambdaResponse = await fetch(STREAM_LAMBDA_URL);

    if (!lambdaResponse.ok) {
      return NextResponse.json(
        { error: `Lambda responded with status: ${lambdaResponse.status}` },
        { status: lambdaResponse.status }
      );
    }

    // 确保 Lambda 返回的是流
    if (!lambdaResponse.body) {
      return NextResponse.json(
        { error: 'Lambda did not return a readable stream' },
        { status: 500 }
      );
    }

    // 处理流式响应
    const reader = lambdaResponse.body.getReader();

    // 处理函数：将 Lambda 返回的数据片段写入我们的响应流
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.close();
            break;
          }
          // 直接将数据写入响应流
          await writer.write(value);
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        try {
          await writer.abort(error as Error);
        } catch (closeError) {
          console.error('Error closing stream:', closeError);
        }
      }
    };

    // 启动流处理（不等待完成）
    processStream();

    // 返回流式响应
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to connect to Lambda: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// 支持 POST 请求，以便我们可以将数据传递给 Lambda
export async function POST(request: NextRequest) {
  try {
    // 从请求中获取 JSON 数据
    const body = await request.json();
    
    // 创建一个可读流
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // 发起 POST 请求到 Lambda 函数，并包含用户数据
    const lambdaResponse = await fetch(STREAM_LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!lambdaResponse.ok || !lambdaResponse.body) {
      return NextResponse.json(
        { error: `Lambda responded with status: ${lambdaResponse.status}` },
        { status: lambdaResponse.status || 500 }
      );
    }

    // 处理流式响应
    const reader = lambdaResponse.body.getReader();

    // 处理函数：将 Lambda 返回的数据片段写入我们的响应流
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.close();
            break;
          }
          await writer.write(value);
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        try {
          await writer.abort(error as Error);
        } catch (closeError) {
          console.error('Error closing stream:', closeError);
        }
      }
    };

    // 启动流处理（不等待完成）
    processStream();

    // 返回流式响应
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API POST route error:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
