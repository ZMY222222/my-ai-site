"use client";

import { useRef, useCallback } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

interface ScrollRevealPhotoProps {
  photoA: string;
  photoB: string;
  height?: number;
  className?: string;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function ScrollRevealPhoto({
  photoA,
  photoB,
  height = 560,
  className,
}: ScrollRevealPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);

  const onScroll = useCallback((smoothDir: number) => {
    const container = containerRef.current;
    const imgA = imgARef.current;
    const imgB = imgBRef.current;
    if (!container || !imgA || !imgB) return;

    const rect = container.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = Math.abs(elementCenter - viewportCenter);
    const falloffRange = viewportCenter * 1.2;
    const visibility = clamp(1 - distance / falloffRange, 0, 1);

    const dirWeightA = clamp(smoothDir, 0, 1);
    const dirWeightB = clamp(-smoothDir, 0, 1);

    const effectA = visibility * dirWeightA;
    const effectB = visibility * dirWeightB;

    imgA.style.opacity = String(effectA);
    imgA.style.transform = `translateY(${60 * (1 - effectA)}px) scale(${0.85 + 0.15 * effectA})`;

    imgB.style.opacity = String(effectB);
    imgB.style.transform = `translateY(${-60 * (1 - effectB)}px) scale(${0.85 + 0.15 * effectB})`;
  }, []);

  useScrollDirection(onScroll);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        width: "100%",
        borderRadius: 20,
        border: "0.5px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <img
        ref={imgARef}
        src={photoA}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0,
          transform: "translateY(60px) scale(0.85)",
          willChange: "transform, opacity",
        }}
      />
      <img
        ref={imgBRef}
        src={photoB}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0,
          transform: "translateY(-60px) scale(0.85)",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
