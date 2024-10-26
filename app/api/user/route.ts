import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    name: "张三",
    id: "001",
    role: "admin",
    requestTime: timestamp
  });
}