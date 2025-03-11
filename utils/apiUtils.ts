import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface ServerFetchOptions {
  method?: string;
  body?: any;
  searchParams?: Record<string, string | number>;
}

export async function apiRequest(endpoint: string, options: ServerFetchOptions = {}) {
  const { method = 'GET', body, searchParams } = options;
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  // 确保 endpoint 以 / 开头，但不要重复
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 构建 URL，确保没有双斜杠
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const url = new URL(`${baseUrl}${normalizedEndpoint}`);
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  console.log('API Request:', {
    url: url.toString(),
    method,
    searchParams
  });

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
    console.error('API Request failed:', {
      status: response.status,
      statusText: response.statusText,
      url: url.toString()
    });
    return NextResponse.json(
      { success: false, message: 'API request failed', error: response.statusText },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
} 