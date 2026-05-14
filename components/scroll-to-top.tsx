"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-5 bottom-40 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#11162A]/90 backdrop-blur-md text-lg text-[#E0E0E0] transition-all hover:border-[#00D4FF]/40 hover:text-[#00D4FF] hover:scale-105 active:scale-95 shadow-lg"
      aria-label="返回顶部"
    >
      ↑
    </button>
  );
}
