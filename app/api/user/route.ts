import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      name: "张三",
      id: "001",
      role: "admin",
      requestTime: timestamp
    });
  } catch (error) {
    console.error('User API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}