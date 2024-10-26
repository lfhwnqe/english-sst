import { NextResponse } from 'next/server';
import type { ProductsData } from '@/types';

export const runtime = 'edge';

export async function GET(): Promise<NextResponse<ProductsData>> {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    products: [
      "iPhone 15 Pro",
      "MacBook Air M2",
      "iPad Pro 2024",
      "AirPods Max",
      "Apple Watch Series 9"
    ],
    requestTime: timestamp
  });
}