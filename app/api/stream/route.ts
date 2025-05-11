import { NextRequest, NextResponse } from 'next/server';

// Lambda u51fdu6570 URL
const LAMBDA_URL = 'https://x45pyto42xqvzksz2mp5m4qdvm0lmkqb.lambda-url.us-east-1.on.aws/';

// u8fd9u4e2a API u8defu7531u5c06u4ee3u7406u8bf7u6c42u5230 Lambda u51fdu6570
export async function GET(request: NextRequest) {
  try {
    // u521bu5efau4e00u4e2au53efu8bfbu6d41u7684u8f6cu6362u5668
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // u53d1u8d77u8bf7u6c42u5230 Lambda u51fdu6570
    const lambdaResponse = await fetch(LAMBDA_URL);

    if (!lambdaResponse.ok) {
      return NextResponse.json(
        { error: `Lambda responded with status: ${lambdaResponse.status}` },
        { status: lambdaResponse.status }
      );
    }

    // u786eu4fdd Lambda u8fd4u56deu7684u662fu6d41
    if (!lambdaResponse.body) {
      return NextResponse.json(
        { error: 'Lambda did not return a readable stream' },
        { status: 500 }
      );
    }

    // u5904u7406u6d41u5f0fu54cdu5e94
    const reader = lambdaResponse.body.getReader();

    // u5904u7406u51fdu6570uff1au5c06 Lambda u8fd4u56deu7684u6570u636eu7247u6bb5u5199u5165u6211u4eecu7684u54cdu5e94u6d41
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.close();
            break;
          }
          // u76f4u63a5u5c06u6570u636eu5199u5165u54cdu5e94u6d41
          await writer.write(value);
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        // u5c1du8bd5u4f18u96c5u5730u5173u95edu6d41
        try {
          await writer.abort(error as Error);
        } catch (closeError) {
          console.error('Error closing stream:', closeError);
        }
      }
    };

    // u542fu52a8u6d41u5904u7406uff08u4e0du7b49u5f85u5b8cu6210uff09
    processStream();

    // u8fd4u56deu6d41u5f0fu54cdu5e94
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
