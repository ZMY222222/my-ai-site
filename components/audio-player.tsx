"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectAudio } from "@/components/audio-analyser";

const AUDIO_SRC = "/atlasaudio-nature-piano-519619.mp3";

export function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.4;
    audio.crossOrigin = "anonymous";
    audio.addEventListener("play", () => {
      setPlaying(true);
      connectAudio(audio);
    });
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => setPlaying(false));
    audioRef.current = audio;

    const tryPlay = () => {
      if (audio.paused) {
        audio.play().then(() => {}, () => {});
      }
    };

    const onInteraction = () => {
      tryPlay();
    };

    document.addEventListener("click", onInteraction, { once: true });
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("keydown", onInteraction, { once: true });

    // 也尝试立即播放
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => {}, () => {});
    else audio.pause();
  }, []);

  return (
    <div className="fixed right-4 top-20 z-[60] flex select-none items-center gap-2">
      <div
        className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
          collapsed
            ? "w-10 h-10 justify-center border-white/10 bg-[#11162A]/90 backdrop-blur-md"
            : "h-10 px-4 gap-3 border-white/15 bg-[#11162A]/90 backdrop-blur-md"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-[#B8C1D0] transition hover:text-[#E6EAF2]"
          aria-label={collapsed ? "展开音乐面板" : "收起音乐面板"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>

        {!collapsed && (
          <button
            onClick={togglePlay}
            className="shrink-0 flex items-center gap-1.5 text-xs text-[#BFC8D6] transition hover:text-[#E6EAF2]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={playing ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {playing ? (
                <>
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </>
              ) : (
                <polygon points="5 3 19 12 5 21 5 3" />
              )}
            </svg>
            <span className="whitespace-nowrap">{playing ? "暂停" : "播放"}</span>
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="flex h-10 items-center rounded-full border border-white/10 bg-[#11162A]/90 backdrop-blur-md px-3">
          <span className="text-xs text-[#BFC8D6] whitespace-nowrap">
            {playing ? "🎵 正在播放" : "⏸ 已暂停"}
          </span>
        </div>
      )}
    </div>
  );
}
