import { NextRequest } from "next/server";
import { apiRequest } from "@/utils/apiUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return apiRequest("/image/upload-url", {
      method: "POST",
      body,
    });
  } catch (error) {
    console.error("Image Upload URL API Error:", error);
    return Response.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
} 