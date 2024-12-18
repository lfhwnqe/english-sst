import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function GET() {
  try {
    const response = await fetch(`${getBaseUrl()}/auth/user-info`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get user info" },
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