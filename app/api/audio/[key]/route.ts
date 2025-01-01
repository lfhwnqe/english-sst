import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function GET(req: Request, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  try {
    const { key } = params;

    const response = await fetch(`${getBaseUrl()}/audio/url/${encodeURIComponent(key)}`, {
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get audio URL" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get audio URL error:", error);
    return NextResponse.json(
      { error: "Failed to get audio URL" },
      { status: 500 }
    );
  }
} 