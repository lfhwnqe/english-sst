import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

export async function GET(
  req: Request,
  { params }: { params: { sceneId: string } }
) {
  try {
    const { sceneId } = params;

    const response = await fetch(`${getBaseUrl()}/audio-scene/${sceneId}`, {
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to get scene" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get scene error:", error);
    return NextResponse.json(
      { error: "Failed to get scene" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sceneId: string } }
) {
  try {
    const { sceneId } = params;
    console.log('Frontend API - Delete Scene Request:', {
      sceneId,
      url: `${getBaseUrl()}/audio-scene/${sceneId}`,
      cookie: req.headers.get('cookie'),
    });

    const response = await fetch(`${getBaseUrl()}/audio-scene/${sceneId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    console.log('Frontend API - Delete Scene Response:', {
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "删除场景失败" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("删除场景错误:", error);
    return NextResponse.json(
      { error: "删除场景失败" },
      { status: 500 }
    );
  }
} 