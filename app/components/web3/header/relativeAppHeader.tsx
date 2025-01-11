"use client";
import BaseHeader from "./baseHeader";
import { useAtom } from "jotai";
import { hasTokenAtom } from "@/app/stores/cookie";

export default function RelativeAppHeader() {
  const [hasToken] = useAtom(hasTokenAtom);
  return (
    <div className="w-full top-0 z-50">
      <BaseHeader hasTokenServer={hasToken} />
    </div>
  );
} 