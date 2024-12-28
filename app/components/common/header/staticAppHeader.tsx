"use client";
import BaseHeader from "./baseHeader";

export default function StaticAppHeader() {
  return (
    <>
      {/* 占位元素，防止内容被固定定位的header遮挡 */}
      <div className="h-16"></div>
      {/* 固定定位的header */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <BaseHeader />
      </div>
    </>
  );
} 