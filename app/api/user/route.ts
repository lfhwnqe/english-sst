import { NextResponse } from 'next/server';
import type { UserData } from '@/types';

export const runtime = 'edge';

export async function GET(): Promise<NextResponse<UserData>> {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    name: "张三",
    id: "001",
    role: "admin",
    requestTime: timestamp
  });
}