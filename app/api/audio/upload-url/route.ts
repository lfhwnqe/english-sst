import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, fileType } = body;

    const response = await fetch(`${getBaseUrl()}/audio/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify({ fileName, fileType }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get upload URL" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload URL error:", error);
    return NextResponse.json(
      { error: "Failed to get upload URL" },
      { status: 500 }
    );
  }
} 