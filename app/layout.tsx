import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Amplify, ResourcesConfig } from "aws-amplify";
import config from "@/aws-exports";
// import { generateClient } from "aws-amplify/api";

Amplify.configure(config as ResourcesConfig);
// export const client = generateClient();
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
  title: "毛毛虫公司",
  description: "maomaocong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
