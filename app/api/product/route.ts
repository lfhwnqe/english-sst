import { NextResponse } from 'next/server';
import type { ProductsData } from '@/types';

export const runtime = 'edge';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}