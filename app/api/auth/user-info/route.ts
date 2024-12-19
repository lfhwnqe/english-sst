import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function GET(req: Request) {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    // 从 cookie 中提取 token
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) || {};

    // 如果有 accessToken，添加到 Authorization 头
    if (cookies['accessToken']) {
      headers.set('Authorization', `Bearer ${cookies['accessToken']}`);
    }

    const response = await fetch(`${getBaseUrl()}/auth/user-info`, {
      headers,
      credentials: 'include',
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to get user info" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get user info error:", error);
    return NextResponse.json(
      { error: "Failed to get user info" },
      { status: 500 }
    );
  }
} 