"use client";
import { useAtom } from "jotai";
import BaseHeader from "./baseHeader";
import { hasTokenAtom } from "@/app/stores/cookie";

export default function StaticAppHeader() {
  const [hasToken] = useAtom(hasTokenAtom);
  return (
    <>
      {/* 占位元素，防止内容被固定定位的header遮挡 */}
      {/* <div className="h-16"></div> */}
      {/* 固定定位的header */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <BaseHeader hasTokenServer={hasToken} />
      </div>
    </>
  );
}
