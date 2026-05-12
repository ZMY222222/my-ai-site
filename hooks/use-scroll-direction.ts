"use client";

import { useEffect, useRef } from "react";

const listeners = new Set<(smoothDir: number) => void>();
let lastScrollY = 0;
let smoothDir = 0;
let rafId: number | null = null;
let initialized = false;

function initGlobalScrollListener() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const onScroll = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) > 0.5) {
        const targetDir = Math.sign(delta);
        smoothDir += (targetDir - smoothDir) * 0.15;
      }

      lastScrollY = currentScrollY;
      listeners.forEach((fn) => fn(smoothDir));
      rafId = null;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

export function useScrollDirection(onUpdate: (smoothDir: number) => void) {
  const cbRef = useRef(onUpdate);
  cbRef.current = onUpdate;

  useEffect(() => {
    initGlobalScrollListener();

    const handler = (dir: number) => cbRef.current(dir);
    listeners.add(handler);

    return () => {
      listeners.delete(handler);
    };
  }, []);
}
