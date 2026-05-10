"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectAudio } from "@/components/audio-analyser";

const RAIN_SRC = "/rain-sounds.mp3";
const MUSIC_SRC = "/atlasaudio-nature-piano-519619.mp3";

export function FloatAudioButton() {
  const [open, setOpen] = useState(false);
  const [rainPlaying, setRainPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Rain audio
  useEffect(() => {
    const a = new Audio(encodeURI(RAIN_SRC));
    a.loop = true; a.volume = 0.35;
    rainRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  // Music audio
  useEffect(() => {
    const a = new Audio(MUSIC_SRC);
    a.loop = true; a.volume = 0.4;
    a.crossOrigin = "anonymous";
    a.addEventListener("play", () => { setMusicPlaying(true); connectAudio(a); });
    a.addEventListener("pause", () => setMusicPlaying(false));
    a.addEventListener("ended", () => setMusicPlaying(false));
    musicRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleRain = useCallback(() => {
    const a = rainRef.current; if (!a) return;
    if (a.paused) { a.play().catch(() => {}); setRainPlaying(true); }
    else { a.pause(); setRainPlaying(false); }
  }, []);

  const toggleMusic = useCallback(() => {
    const a = musicRef.current; if (!a) return;
    if (a.paused) { a.play().catch(() => {}); }
    else { a.pause(); }
  }, []);

  return (
    <div ref={btnRef} className="fixed right-5 bottom-24 z-[70] select-none flex flex-col items-end gap-2">
      {/* Expanded menu */}
      {open && (
        <div className="flex flex-col gap-2 items-end mb-1">
          <button onClick={toggleRain} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all backdrop-blur-md ${rainPlaying ? "border-[#6EA8FE]/30 bg-[#6EA8FE]/15 text-[#E6EAF2]" : "border-white/10 bg-[#11162A]/90 text-[#B8C1D0] hover:border-white/20"}`}>
            <span>{rainPlaying ? "🌧" : "🌧"}</span>
            <span className="whitespace-nowrap">{rainPlaying ? "关闭雨声" : "开启雨声"}</span>
          </button>
          <button onClick={toggleMusic} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all backdrop-blur-md ${musicPlaying ? "border-[#6EA8FE]/30 bg-[#6EA8FE]/15 text-[#E6EAF2]" : "border-white/10 bg-[#11162A]/90 text-[#B8C1D0] hover:border-white/20"}`}>
            <span>🎵</span>
            <span className="whitespace-nowrap">{musicPlaying ? "暂停音乐" : "播放音乐"}</span>
          </button>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#11162A]/90 backdrop-blur-md text-xl transition-all hover:border-white/25 hover:scale-105 active:scale-95 shadow-lg"
        aria-label="音频控制"
      >
        🎵
      </button>
    </div>
  );
}
