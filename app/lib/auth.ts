import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.get("accessToken");
  return hasToken ? true : false;
}
