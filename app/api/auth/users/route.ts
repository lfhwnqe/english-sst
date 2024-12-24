import { apiRequest } from "@/utils/apiUtils";

export async function GET() {
  return apiRequest("/auth/users");
}

export async function POST(req: Request) {
  const body = await req.json();
  return apiRequest("/auth/set-admin", {
    method: "POST",
    body,
  });
}
