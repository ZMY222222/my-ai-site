"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassBreakTransition } from "@/components/glass-break-transition";
import { VortexButton } from "@/components/vortex-button";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const FLOATING_SHAPES = [
  { emoji: "✨", top: "8%", left: "5%", size: "text-5xl", anim: "animate-float", delay: "0s" },
  { emoji: "🚀", top: "15%", right: "8%", size: "text-6xl", anim: "animate-bounce-subtle", delay: "0.5s" },
  { emoji: "💫", top: "65%", left: "3%", size: "text-4xl", anim: "animate-float-reverse", delay: "1s" },
  { emoji: "⚡", top: "70%", right: "6%", size: "text-5xl", anim: "animate-wiggle", delay: "0.3s" },
  { emoji: "🔥", top: "40%", left: "8%", size: "text-4xl", anim: "animate-bounce-subtle", delay: "0.7s" },
  { emoji: "🎯", top: "35%", right: "5%", size: "text-5xl", anim: "animate-float", delay: "1.2s" },
  { emoji: "💬", bottom: "15%", left: "10%", size: "text-4xl", anim: "animate-wiggle", delay: "0.4s" },
  { emoji: "🧠", bottom: "20%", right: "10%", size: "text-5xl", anim: "animate-float-reverse", delay: "0.8s" },
];

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const router = useRouter();
  const navRef = useRef(false);

  const handleClick = () => {
    if (navRef.current) return;
    navRef.current = true;
    const voice = new Audio(encodeURI("/新录音 7.m4a"));
    voice.volume = 0.7;
    (window as any).__welcomeVoice = voice;
    voice.play().catch(() => {});
    setBreaking(true);
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden" style={{ background: "#0D0D1A" }}>
      <GlassBreakTransition trigger={breaking} onComplete={() => router.push("/home")} sound />

      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #FF3AF2 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 230, 0, 0.08) 10px, rgba(255, 230, 0, 0.08) 20px)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(255,58,242,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,245,212,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(123,47,255,0.08) 0%, transparent 60%)" }} />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none" aria-hidden="true">
        <span className="font-outfit font-black uppercase" style={{ fontSize: "clamp(10rem, 25vw, 20rem)", color: "#7B2FFF", opacity: 0.06, letterSpacing: "-0.05em", lineHeight: 1 }}>WOW</span>
      </div>

      <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${ACCENT_COLORS.join(", ")})` }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${[...ACCENT_COLORS].reverse().join(", ")})` }} aria-hidden="true" />

      {FLOATING_SHAPES.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${shape.size} ${shape.anim} pointer-events-none select-none`}
          style={{ top: shape.top, left: shape.left, right: shape.right, bottom: shape.bottom, animationDelay: shape.delay, willChange: "transform" } as React.CSSProperties}
          aria-hidden="true"
        >
          {shape.emoji}
        </div>
      ))}

      <div className="absolute top-[10%] left-[15%] w-16 h-16 rounded-full animate-spin-slow pointer-events-none" style={{ border: "4px dashed #00F5D4", opacity: 0.2 }} aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[15%] w-20 h-20 rounded-full animate-spin-slow pointer-events-none" style={{ border: "4px dashed #FFE600", opacity: 0.15, animationDirection: "reverse" }} aria-hidden="true" />
      <div className="absolute top-[50%] right-[3%] w-6 h-6 rotate-45 animate-float pointer-events-none" style={{ background: "#FF6B35", opacity: 0.3 }} aria-hidden="true" />
      <div className="absolute top-[25%] left-[3%] w-4 h-4 rotate-12 animate-bounce-subtle pointer-events-none" style={{ background: "#FF3AF2", opacity: 0.25 }} aria-hidden="true" />

      <div className={`relative z-10 flex flex-col items-center text-center px-6 py-16 w-full max-w-3xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-block px-5 py-1.5 rounded-full mb-8 border-4 border-dashed" style={{ borderColor: "#00F5D4", background: "rgba(45, 27, 78, 0.6)" }}>
          <span className="text-xs tracking-[0.3em] uppercase font-bold font-space-mono" style={{ color: "#00F5D4" }}>AI Training · Data Engineering · Systems</span>
        </div>

        <h1 className="font-outfit font-black tracking-tight text-shadow-mega" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 1, color: "#FFFFFF" }}>
          <span className="gradient-text" style={{ display: "inline-block" }}>朱 美 阳</span>
        </h1>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-1 w-12 rounded-full" style={{ background: "linear-gradient(90deg, #FF3AF2, transparent)" }} />
          <div className="px-4 py-1.5 rounded-full border-4" style={{ borderColor: "#FFE600", background: "rgba(45, 27, 78, 0.5)" }}>
            <span className="text-lg sm:text-xl tracking-[0.15em] font-bold font-outfit uppercase" style={{ color: "#FFE600", textShadow: "2px 2px 0px #7B2FFF" }}>AI训练师 / 大模型数据专家</span>
          </div>
          <div className="h-1 w-12 rounded-full" style={{ background: "linear-gradient(270deg, #00F5D4, transparent)" }} />
        </div>

        <p className="mt-10 max-w-lg text-lg sm:text-xl leading-relaxed text-white/90 font-dm-sans">
          我训练的不只是数据，而是
          <span className="font-bold inline-block mx-1 px-2 py-0.5 rounded-lg border-4 border-dashed" style={{ borderColor: "#FF3AF2", color: "#FF3AF2", background: "rgba(255,58,242,0.1)", textShadow: "0 0 10px rgba(255,58,242,0.5)" }}>
            AI 理解人的方式
          </span>
          。
        </p>

        <div className="mt-10 flex items-center gap-3">
          {ACCENT_COLORS.map((c, i) => (
            <div key={i} className="h-2 w-2 rounded-full animate-bounce-subtle" style={{ background: c, animationDelay: `${i * 0.2}s`, boxShadow: `0 0 8px ${c}` }} aria-hidden="true" />
          ))}
        </div>

        <div className="mt-14 relative">
          <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ filter: "blur(20px)" }} aria-hidden="true" />
          <VortexButton onClick={handleClick} disabled={breaking} />
        </div>

        <div className="mt-14 px-4 py-1.5 rounded-full border-2" style={{ borderColor: "rgba(123,47,255,0.4)", background: "rgba(45, 27, 78, 0.3)" }}>
          <span className="text-[10px] tracking-[0.24em] uppercase font-bold font-space-mono" style={{ color: "#7B2FFF" }}>Personal Brand · AI Trainer</span>
        </div>
      </div>
    </main>
  );
}
