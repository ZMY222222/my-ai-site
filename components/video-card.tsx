"use client";

import { useState } from "react";
import { AdaptiveImage } from "@/components/adaptive-image";

type VideoCardProps = {
  base: string;
  alt: string;
  model: string;
  videoSrc: string;
};

export function VideoCard({ base, alt, model, videoSrc }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={() => setPlaying(false)}>
        <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setPlaying(false)}
            className="absolute -top-10 right-0 text-sm text-[#E0E0E0] hover:text-white transition"
          >
            关闭 ✕
          </button>
          <video
            src={videoSrc}
            controls
            autoPlay
            className="w-full rounded-2xl"
            playsInline
          >
            <track kind="captions" />
          </video>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group overflow-hidden rounded-[20px] border border-white/10 bg-[#151B34]/80 transition hover:border-white/20 text-left w-full"
    >
      <div className="aspect-[4/3] bg-[#0D1225] relative">
        <AdaptiveImage
          base={base}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00D4FF]/25 border border-[#00D4FF]/50 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[#00D4FF]/35">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M2 0.5L16 10L2 19.5V0.5Z" fill="#00D4FF"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 z-10 rounded-full bg-[#0B1020]/85 px-3 py-1 text-xs text-[#F5F5F5] border border-white/15 backdrop-blur">
          {model}
        </div>
      </div>
    </button>
  );
}
