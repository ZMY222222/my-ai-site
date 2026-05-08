"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const tabs = [
  { key: "about", label: "核心优势" },
  { key: "work", label: "工作经历" },
  { key: "education", label: "教育背景" },
  { key: "skills", label: "专业技能" },
  { key: "portfolio", label: "作品集" },
  { key: "contact", label: "联系" },
];

export function SlideContainer({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - width;
    const idx = Math.round(scrollLeft / width);
    setActiveIndex(idx);
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
  };

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * dir, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <div className="flex items-center gap-1 px-1 py-2 lg:py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => scrollTo(i)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs transition ${
              i === activeIndex
                ? "bg-[#6EA8FE]/15 text-[#6EA8FE] border border-[#6EA8FE]/30"
                : "border border-white/8 bg-white/[0.02] text-[#B8C1D0] hover:border-white/15 hover:text-[#E6EAF2]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <button
          onClick={() => scrollBy(-1)}
          className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#11162A]/90 text-[#E6EAF2] backdrop-blur transition hover:border-white/20 hover:bg-[#151B34] ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="上一页"
        >
          ←
        </button>
        <button
          onClick={() => scrollBy(1)}
          className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#11162A]/90 text-[#E6EAF2] backdrop-blur transition hover:border-white/20 hover:bg-[#151B34] ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="下一页"
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {children}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-3">
        {tabs.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? "h-2 w-5 bg-[#6EA8FE]"
                : "h-2 w-2 bg-white/15 hover:bg-white/25"
            }`}
            aria-label={`切换到${tabs[i].label}`}
          />
        ))}
      </div>
    </div>
  );
}
