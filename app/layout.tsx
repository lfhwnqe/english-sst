import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ThemeProvider from "@/app/components/common/providers/themeProvider";
import { getAuthAndThemeFromCookie } from "./lib/auth";
import AuthProvider from "@/app/components/common/providers/AuthProvider";
import Web3Provider from "@/app/components/common/providers/wagmiProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "毛毛虫公司",
  description: "maomaocong",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasToken, theme } = await getAuthAndThemeFromCookie();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider theme={theme}>
          <AuthProvider hasToken={hasToken}>
            <Web3Provider>
              <main className="pt-16">{children}</main>
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
