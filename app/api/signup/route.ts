import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 转发请求到后端服务
    const response = await fetch(`${getBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // 如果后端返回错误
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
