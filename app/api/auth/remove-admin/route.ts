import { apiRequest } from "@/utils/apiUtils";

export async function POST(req: Request) {
  const body = await req.json();
  return apiRequest("/auth/remove-admin", {
    method: "POST",
    body,
  });
}
