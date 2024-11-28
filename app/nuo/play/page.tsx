"use client";

// import ScrollPlayer from "@/app/components/common/scrollPlayer";
import { useSearchParams } from "next/navigation";
import { sectionMap } from "./constant";
import ScrollPagedContent from "@/app/components/common/scrollPagedContent";

export default function Play() {
  const searchParams = useSearchParams();

  const sectionId = searchParams.get("sectionId") || ""; // 获取 query 参数 `paramA`
  const sectionContent = sectionId && sectionMap?.[sectionId];
  if (!sectionContent) return null;
  return (
    <div>
      <ScrollPagedContent
        audioUrl={sectionContent.url}
        name={sectionContent.name}
        text={sectionContent.str}
      />
    </div>
  );
}
