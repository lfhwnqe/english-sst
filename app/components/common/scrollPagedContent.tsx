import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import AudioPlayer from "./h5AudioPlayer";
import ResponsiveAppBar from './appHeader'
interface Props {
  audioUrl: string;
  text: string;
  name: string;
}

const ScrollPagedContent: React.FC<Props> = ({ audioUrl, text, name }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const lines = text.split("\n");

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Calculate total pages
    const calculateTotalPages = () => {
      const total = Math.ceil(container.scrollHeight / container.clientHeight);
      setTotalPages(total);
    };

    // Initial calculation
    calculateTotalPages();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateTotalPages);
    resizeObserver.observe(container);

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      const page = Math.floor(currentScroll / container.clientHeight) + 1;
      setCurrentPage(page);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToPage = (direction: "up" | "down") => {
    const container = contentRef.current;
    if (!container) return;

    const isAtBottom =
      Math.ceil(container.scrollTop + container.clientHeight) >=
      container.scrollHeight;
    const isAtTop = container.scrollTop === 0;

    if (direction === "down" && isAtBottom) {
      // At bottom, scroll to top
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setCurrentPage(1);
    } else if (direction === "up" && isAtTop) {
      // At top, scroll to bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
      setCurrentPage(totalPages);
    } else {
      // Normal scroll up/down
      const targetScroll =
        direction === "up"
          ? container.scrollTop - container.clientHeight
          : container.scrollTop + container.clientHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overscroll-none">
      <ResponsiveAppBar></ResponsiveAppBar>
      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory"
      >
        <div className="p-4 min-h-full snap-start">
          <h1 className="text-lg mb-2 font-bold">{name}</h1>
          {lines.map((line, index) => (
            <p key={index} className="mb-2 text-lg">
              {line}
            </p>
          ))}
        </div>
      </main>

      <div className="flex justify-between items-center p-1">
        <button onClick={() => scrollToPage("up")} className="p-2">
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => scrollToPage("down")} className="p-2">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="w-full pb-safe">
        <AudioPlayer src={audioUrl} />
      </div>
    </div>
  );
};

export default ScrollPagedContent;
