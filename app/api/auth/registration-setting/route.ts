import { apiRequest } from "@/utils/apiUtils";

export async function GET() {
  return apiRequest("/auth/registration-setting");
}

export async function POST(req: Request) {
  const body = await req.json();
  return apiRequest("/auth/registration-setting", {
    method: "POST",
    body,
  });
} 