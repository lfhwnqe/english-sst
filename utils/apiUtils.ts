import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { handleLambdaResponse } from './index';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface ServerFetchOptions {
  method?: string;
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}

export async function apiRequest(endpoint: string, options: ServerFetchOptions = {}) {
  const { method = 'GET', body, searchParams } = options;
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  // 构建 URL
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  console.log('serverFetchApi url', url.toString());

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      cookie,
    },
    credentials: 'include',
    ...(body && { body: JSON.stringify(body) }),
    cache: 'no-store'
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'API request failed' },
      { status: response.status }
    );
  }

  const rawData = await response.json();
  // 处理Lambda Function URL响应格式
  const processedData = handleLambdaResponse(rawData);
  return NextResponse.json(processedData);
} 