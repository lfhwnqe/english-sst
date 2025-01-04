import { cookies } from "next/headers";

export async function getAuthAndThemeFromCookie() {
  const cookieStore = await cookies();
  const hasTokenCookie = cookieStore.get("accessToken")?.value;
  const hasToken = hasTokenCookie ? true : false;
  const theme = cookieStore.get("theme")?.value || "light";
  return { hasToken, theme };
}
