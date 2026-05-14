"use client";

import { useEffect, useRef, useState } from "react";

const MIN_DISPLAY = 800;

export function InitialLoader() {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastRef = useRef(0);
  const doneRef = useRef(false);
  const rafRef = useRef(0);
  const startedRef = useRef(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.touchAction = "none";

    startedRef.current = Date.now();

    const tick = () => {
      if (doneRef.current) return;
      const elapsed = Date.now() - startedRef.current;
      const raw = Math.min(1, elapsed / MIN_DISPLAY);
      const eased = 1 - (1 - raw) ** 3;
      const next = Math.min(99, Math.round(eased * 100));
      if (next > lastRef.current) {
        lastRef.current = next;
        setProgress(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      setProgress(100);

      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
          document.documentElement.style.touchAction = "";
        }, 350);
      }, 200);
    };

    // 保底：至少 MIN_DISPLAY + 退出动画时间
    setTimeout(finish, MIN_DISPLAY + 200);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A]"
      style={{
        pointerEvents: exiting ? "none" : "auto",
        animation: exiting
          ? "transition-fade-out 0.45s ease forwards"
          : "transition-fade-in 0.25s ease forwards",
      }}
    >
      <div
        className="flex flex-col items-center justify-center text-center select-none px-6"
        style={{
          animation: exiting ? undefined : "transition-breathe 2.4s ease-in-out infinite",
        }}
      >
        <div className="text-2xl font-semibold tracking-[0.12em] text-[#E6EAF2] md:text-3xl">
          ZMY 朱美阳
        </div>
        <div className="mt-3 text-sm tracking-[0.28em] text-[#E0E0E0] font-light md:text-base">
          AI 个人站
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-[200px] flex-col items-center gap-2 px-4">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#8B7CFF] shadow-[0_0_6px_rgba(0,212,255,0.5)] transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10px] tracking-[0.12em] text-[#E0E0E0]/50">
          {progress}%
        </div>
      </div>
    </div>
  );
}
