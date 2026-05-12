"use client";

import { useState, useCallback } from "react";
import { AdaptiveImage } from "./adaptive-image";

type GalleryImage = { base: string; alt: string };
type Gallery = { category: string; label: string; images?: GalleryImage[] };

function LightboxImage({ base, alt }: { base: string; alt: string }) {
  const EXTS = [".png", ".jpg", ".jpeg", ".webp"];
  const [idx, setIdx] = useState(0);
  return (
    <img
      src={`${base}${EXTS[idx]}`}
      alt={alt}
      className="max-w-full max-h-[80vh] rounded-2xl object-contain"
      onClick={(e) => e.stopPropagation()}
      onError={() => { if (idx < EXTS.length - 1) setIdx(idx + 1); }}
    />
  );
}

export function GalleryGrid({ galleries }: { galleries: Gallery[] }) {
  const [lightbox, setLightbox] = useState<{ base: string; alt: string; idx: number; total: number; all: GalleryImage[] } | null>(null);

  const allImages = galleries.flatMap((g) => g.images ?? []);

  const openLightbox = useCallback((img: GalleryImage) => {
    const idx = allImages.indexOf(img);
    setLightbox({ base: img.base, alt: img.alt, idx, total: allImages.length, all: allImages });
  }, [allImages]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <>
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          {galleries.map((gallery) => (
            <div key={gallery.category} className="mb-16">
              <h2 className="mb-6 border-b border-white/10 pb-4 text-2xl font-semibold text-[#E6EAF2]">
                {gallery.label}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {gallery.images?.map((img) => (
                  <button
                    key={img.alt}
                    onClick={() => openLightbox(img)}
                    className="overflow-hidden rounded-[20px] border border-white/10 bg-[#151B34]/80 transition hover:border-white/20 cursor-pointer p-0 w-full block text-left"
                  >
                    <div className="aspect-[4/3] bg-[#0D1225] relative">
                      <AdaptiveImage
                        base={img.base}
                        alt={img.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white border-0 bg-white/5 cursor-pointer text-xl z-10"
            onClick={closeLightbox}
            aria-label="关闭"
          >
            ✕
          </button>

          <LightboxImage key={lightbox.base} base={lightbox.base} alt={lightbox.alt} />

          <div className="mt-5 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm" style={{ color: "#fff", fontFamily: "'Space Mono', monospace", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              {lightbox.alt}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => { if (!prev) return null; const idx = (prev.idx - 1 + prev.total) % prev.total; return { ...prev, base: prev.all[idx].base, alt: prev.all[idx].alt, idx }; }); }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/15 bg-white/5 cursor-pointer transition-colors"
              aria-label="上一张"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="text-white/30 text-sm self-center" style={{ fontFamily: "'Space Mono', monospace" }}>
              {lightbox.idx + 1} / {lightbox.total}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => { if (!prev) return null; const idx = (prev.idx + 1) % prev.total; return { ...prev, base: prev.all[idx].base, alt: prev.all[idx].alt, idx }; }); }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/15 bg-white/5 cursor-pointer transition-colors"
              aria-label="下一张"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
