import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const timestamp = new Date().toISOString();

    // 创建响应
    const response = NextResponse.json({
      products: [
        "iPhone 15 Pro",
        "MacBook Air M2",
        "iPad Pro 2024",
        "AirPods Max",
        "Apple Watch Series 9"
      ],
      requestTime: timestamp
    });

    // 设置 Cache-Control 头，禁用缓存
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
