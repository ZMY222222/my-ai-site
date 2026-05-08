"use client";

import { useEffect, useRef, useState } from "react";

const RAIN_AUDIO = "/rain-sounds.mp3";

export function RainAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(encodeURI(RAIN_AUDIO));
    audio.loop = true;
    audio.volume = 0.35;
    audio.addEventListener("play", () => setPlaying(true));
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

    // 也尝试立即播放（如果浏览器策略允许）
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => {}, () => {});
    else a.pause();
  };

  return (
    <div className="fixed left-4 top-4 z-50 select-none">
      <div
        className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
          !playing
            ? "w-10 h-10 justify-center border-white/10 bg-[#11162A]/90 backdrop-blur-md"
            : "h-10 pl-4 pr-4 gap-2 border-white/15 bg-[#11162A]/90 backdrop-blur-md"
        }`}
      >
        <button
          onClick={togglePlay}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-[#B8C1D0] transition hover:text-[#E6EAF2]"
          aria-label={playing ? "暂停雨声" : "播放雨声"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {playing ? (
              <>
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </>
            ) : (
              <polygon points="5 3 19 12 5 21 5 3" />
            )}
          </svg>
        </button>

        {playing && (
          <span className="text-xs text-[#BFC8D6] whitespace-nowrap">🌧 雨声</span>
        )}
      </div>
    </div>
  );
}
