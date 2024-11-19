"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  audioUrl: string;
  text: string;
}

export default function PagePlayer({ audioUrl, text }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const testDivRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const testDiv = testDivRef.current;
    if (!container || !testDiv) return;

    const containerHeight = container.clientHeight;
    const lines = text.split("\n");
    const pagesArr: string[] = [];
    let currentPage: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      testDiv.textContent = currentPage.join("\n") + "\n" + line;

      if (testDiv.scrollHeight > containerHeight && currentPage.length > 0) {
        pagesArr.push(currentPage.join("\n"));
        currentPage = [line];
      } else {
        currentPage.push(line);
      }
    }

    if (currentPage.length > 0) {
      pagesArr.push(currentPage.join("\n"));
    }

    setPages(pagesArr);
  }, [text]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <audio ref={audioRef} src={audioUrl} controls className="w-full mb-4" />

      <div
        ref={containerRef}
        className="h-[calc(100vh-20rem)] bg-gray-900 p-6 rounded-lg text-white mb-4 overflow-hidden"
      >
        <pre className="whitespace-pre-wrap font-sans">
          {pages[currentPage]}
        </pre>
      </div>

      <div
        ref={testDivRef}
        className="absolute invisible h-[calc(100vh-20rem)] whitespace-pre-wrap font-sans p-6 overflow-hidden"
      />

      <div className="flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-sm text-gray-500">
          第 {currentPage + 1}/{pages.length} 页
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}