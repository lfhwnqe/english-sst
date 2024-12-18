"use client";

import { useRouter } from "next/navigation";
import { sectionMap } from "./nuo/play/constant";
import ResponsiveAppBar from "@/app/components/common/appHeader";
import { useUser } from '@/contexts/UserContext';

export default function SectionList() {
  const router = useRouter();
  const { user, loading, error } = useUser();

  const handleSelectSection = (sectionId: string) => {
    router.push(`/nuo/play?sectionId=${sectionId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <ResponsiveAppBar></ResponsiveAppBar>
      <h1 className="text-xl font-bold mb-4">场景列表</h1>

      <div className="space-y-3">
        {Object.entries(sectionMap).map(([id, section]) => (
          <div
            key={id}
            onClick={() => handleSelectSection(id)}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <h2 className="font-medium mb-1">{section.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
