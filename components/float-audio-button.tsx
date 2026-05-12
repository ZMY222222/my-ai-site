"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { connectAudio, subscribe } from "@/components/audio-analyser";

const RAIN_SRC = "/rain-sounds.mp3";
const MUSIC_SRC = "/atlasaudio-nature-piano-519619.mp3";

export function FloatAudioButton() {
  const [rainPlaying, setRainPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [energy, setEnergy] = useState(0);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const startAll = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const r = rainRef.current;
    const m = musicRef.current;
    if (r && r.paused) { r.play().catch(() => {}); setRainPlaying(true); }
    if (m && m.paused) { m.play().catch(() => {}); setMusicPlaying(true); }
  }, []);

  // Rain audio
  useEffect(() => {
    const a = new Audio(encodeURI(RAIN_SRC));
    a.loop = true; a.volume = 0.35;
    a.addEventListener("play", () => setRainPlaying(true));
    a.addEventListener("pause", () => setRainPlaying(false));
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

  // First user interaction → auto-start both
  useEffect(() => {
    const onInteraction = () => startAll();
    document.addEventListener("click", onInteraction);
    document.addEventListener("touchstart", onInteraction);
    return () => {
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
    };
  }, [startAll]);

  // Subscribe to audio energy for ripple
  useEffect(() => {
    return subscribe((e) => setEnergy(e));
  }, []);

  const toggleRain = useCallback(() => {
    const a = rainRef.current; if (!a) return;
    if (a.paused) { a.play().catch(() => {}); setRainPlaying(true); startedRef.current = true; }
    else { a.pause(); setRainPlaying(false); }
  }, []);

  const toggleMusic = useCallback(() => {
    const a = musicRef.current; if (!a) return;
    if (a.paused) { a.play().catch(() => {}); startedRef.current = true; }
    else { a.pause(); }
  }, []);

  const anyPlaying = rainPlaying || musicPlaying;
  const rippleScale = anyPlaying ? 1 + energy * 0.4 : 1;
  const rippleOpacity = anyPlaying ? 0.15 + energy * 0.25 : 0;

  return (
    <div className="fixed right-5 bottom-24 z-[70] select-none flex flex-col items-end gap-2">
      {/* Energy ripple rings */}
      {anyPlaying && (
        <div className="absolute pointer-events-none" style={{ right: 6, bottom: 6 }}>
          {/* Ring 1 */}
          <div
            className="absolute rounded-full border border-[#6EA8FE]/30"
            style={{
              width: 48, height: 48,
              right: -24, bottom: -24,
              transform: `scale(${rippleScale})`,
              opacity: rippleOpacity,
              transition: "transform 0.3s ease-out, opacity 0.3s",
            }}
          />
          {/* Ring 2 */}
          <div
            className="absolute rounded-full border border-[#8B7CFF]/20"
            style={{
              width: 64, height: 64,
              right: -32, bottom: -32,
              transform: `scale(${rippleScale * 0.85})`,
              opacity: rippleOpacity * 0.6,
              transition: "transform 0.5s ease-out, opacity 0.5s",
            }}
          />
        </div>
      )}

      <button
        onClick={toggleRain}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all backdrop-blur-md ${rainPlaying ? "border-[#6EA8FE]/30 bg-[#6EA8FE]/15 text-[#E6EAF2]" : "border-white/10 bg-[#11162A]/90 text-[#B8C1D0] hover:border-white/20"}`}
      >
        <span>🌧</span>
        <span className="whitespace-nowrap">{rainPlaying ? "雨声中" : "开启雨声"}</span>
      </button>

      <button
        onClick={toggleMusic}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all backdrop-blur-md ${musicPlaying ? "border-[#6EA8FE]/30 bg-[#6EA8FE]/15 text-[#E6EAF2]" : "border-white/10 bg-[#11162A]/90 text-[#B8C1D0] hover:border-white/20"}`}
      >
        <span className={`inline-block ${musicPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }}>🎵</span>
        <span className="whitespace-nowrap">{musicPlaying ? "音乐中" : "开启音乐"}</span>
      </button>
    </div>
  );
}
