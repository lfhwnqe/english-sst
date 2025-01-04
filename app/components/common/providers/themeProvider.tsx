"use client";
import { themeAtom } from "@/app/stores/theme";
import { useHydrateAtoms } from "jotai/utils";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export default function Themerovider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  useHydrateAtoms([[themeAtom, theme]]);
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
