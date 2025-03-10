import { NextRequest } from "next/server";
import { apiRequest } from "@/utils/apiUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    return apiRequest(`/image/url/${params.key}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Get Image URL API Error:", error);
    return Response.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
} 