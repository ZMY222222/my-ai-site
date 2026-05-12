"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ParallaxImage } from "@/data/portfolio";

interface ParallaxGalleryProps {
  images: ParallaxImage[];
}

export function ParallaxGallery({ images }: ParallaxGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<ParallaxImage | null>(null);
  const rafRef = useRef(0);

  const n = images.length;
  const overlap = 0.1;
  const zoneSpan = 1 / n;

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = rect.height - vh;
    if (scrollable <= 0) { setProgress(0); setActiveIdx(0); return; }
    const raw = -rect.top / scrollable;
    const p = Math.max(0, Math.min(1, raw));
    setProgress(p);
    const idx = Math.min(n - 1, Math.floor(p * n / (1 - overlap)));
    setActiveIdx(idx);
  }, [n, overlap]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const el = sectionRef.current;
        if (!el) return;
        const next = Math.min(n - 1, activeIdx + 1);
        const targetProgress = (next * zoneSpan) + zoneSpan / 2;
        const targetY = el.offsetTop + (el.offsetHeight - window.innerHeight) * targetProgress;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const el = sectionRef.current;
        if (!el) return;
        const next = Math.max(0, activeIdx - 1);
        const targetProgress = (next * zoneSpan) + zoneSpan / 2;
        const targetY = el.offsetTop + (el.offsetHeight - window.innerHeight) * targetProgress;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, n, zoneSpan]);

  return (
    <>
      <div ref={sectionRef} className="relative" style={{ height: `${images.length * 12}vh` }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ background: "#06090F" }}>
          {images.map((img, i) => {
            const zoneCenter = (i + 0.5) * zoneSpan;
            if (Math.abs(i - activeIdx) > 3) return null;

            const distFromCenter = Math.abs(progress - zoneCenter);
            const halfSpan = zoneSpan / 2 + zoneSpan * overlap / 2;
            const normalizedDist = Math.min(1, distFromCenter / halfSpan);
            const opacity = normalizedDist > 0.7
              ? Math.max(0, 1 - (normalizedDist - 0.7) / 0.3)
              : 1;

            const parallaxFactor = 0.3 + (i / n) * 0.4;
            const translateY = (progress - zoneCenter) * 60 * parallaxFactor;
            const scale = 1 + Math.max(0, 0.05 - normalizedDist * 0.05);

            return (
              <div
                key={img.prefix}
                className="absolute inset-0 flex items-center justify-center"
                style={{ pointerEvents: opacity < 0.05 ? "none" : "auto" }}
              >
                <button
                  className="absolute inset-0 transition-none border-0 bg-transparent cursor-pointer p-0"
                  onClick={() => setLightboxSrc(img)}
                  aria-label={`查看 ${img.label}`}
                  style={{
                    transform: `translateY(${translateY}%) scale(${scale})`,
                    willChange: "transform",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover"
                    style={{ opacity, transition: "opacity 0.15s linear" }}
                    loading={i < 6 ? "eager" : "lazy"}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(0deg, rgba(6,9,15,0.7) 0%, transparent 40%, transparent 60%, rgba(6,9,15,0.7) 100%)",
                      opacity,
                      transition: "opacity 0.15s linear",
                    }}
                  />
                </button>
                <div
                  className="absolute bottom-[18%] left-0 right-0 text-center pointer-events-none"
                  style={{
                    opacity: opacity < 0.3 ? 0 : Math.min(1, (opacity - 0.3) / 0.5),
                    transform: `translateY(${-translateY * 0.3}px)`,
                    transition: "opacity 0.15s linear",
                  }}
                >
                  <div
                    className="text-[10px] tracking-[3px] mb-3"
                    style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.4)" }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-1px] m-0"
                    style={{ color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
                  >
                    {img.label}
                  </h3>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
            <div
              className="h-full transition-none"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #f59e0b, #06b6d4)",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 -mt-8 mb-8 relative z-10">
        {images.map((img, i) => (
          <button
            key={img.prefix}
            onClick={() => {
              const el = sectionRef.current;
              if (!el) return;
              const targetProgress = (i * zoneSpan) + zoneSpan / 2;
              const targetY = el.offsetTop + (el.offsetHeight - window.innerHeight) * targetProgress;
              window.scrollTo({ top: targetY, behavior: "smooth" });
            }}
            className="rounded-full border-0 cursor-pointer transition-all duration-300"
            style={{
              width: i === activeIdx ? 16 : 6,
              height: 6,
              background: i === activeIdx ? "#f59e0b" : "rgba(255,255,255,0.12)",
            }}
            aria-label={img.label}
          />
        ))}
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white border-0 bg-white/5 cursor-pointer text-xl z-10"
            onClick={() => setLightboxSrc(null)}
            aria-label="关闭"
          >
            ✕
          </button>

          <img
            src={lightboxSrc.src}
            alt={lightboxSrc.label}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="mt-5 text-center" onClick={(e) => e.stopPropagation()}>
            <span
              className="text-sm"
              style={{
                color: "#fff",
                fontFamily: "'Space Mono', monospace",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              {lightboxSrc.label}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            {(() => {
              const curIdx = images.findIndex((img) => img === lightboxSrc);
              return (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const prev = (curIdx - 1 + images.length) % images.length;
                      setLightboxSrc(images[prev]);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/15 bg-white/5 cursor-pointer transition-colors"
                    aria-label="上一张"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="text-white/30 text-sm self-center" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {curIdx + 1} / {images.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = (curIdx + 1) % images.length;
                      setLightboxSrc(images[next]);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/15 bg-white/5 cursor-pointer transition-colors"
                    aria-label="下一张"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
