"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassBreakTransition } from "@/components/glass-break-transition";

const nodeLines = [
  "// data.label = 'human_intent'",
  "> training.set(epochs=∞)",
  "{} context.window_size = 8192",
  "// loss converges at step 47k",
  "<SFT> alignment.check()",
  "> agent.think() → agent.act()",
  "// eval.benchmark.pass@1 = 0.94",
];

class Node {
  x = 0; y = 0; r = 0; baseX = 0; baseY = 0; phase = 0; speed = 0; opacity = 0;
  text = ""; textOpacity = 0;
  constructor(w: number, h: number) {
    this.baseX = Math.random() * w;
    this.baseY = Math.random() * h;
    this.x = this.baseX;
    this.y = this.baseY;
    this.r = 0.4 + Math.random() * 1.2;
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.3 + Math.random() * 0.7;
    this.opacity = 0.08 + Math.random() * 0.22;
    this.text = nodeLines[Math.floor(Math.random() * nodeLines.length)];
    this.textOpacity = 0;
  }
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const router = useRouter();
  const navRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const NODE_COUNT = 22;
    const nodeArr: Node[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
    }

    function initNodes() {
      nodeArr.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) nodeArr.push(new Node(window.innerWidth, window.innerHeight));
    }

    resize();
    initNodes();
    window.addEventListener("resize", () => { resize(); initNodes(); });

    let frame = 0;
    function loop() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);
      frame++;

      for (let i = 0; i < nodeArr.length; i++) {
        for (let j = i + 1; j < nodeArr.length; j++) {
          const a = nodeArr[i];
          const b = nodeArr[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 280) {
            const alpha = (1 - d / 280) * 0.04;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(110,168,254,${alpha.toFixed(3)})`;
            ctx!.lineWidth = 0.3;
            ctx!.stroke();
          }
        }
      }

      for (const n of nodeArr) {
        n.phase += 0.005 * n.speed;
        n.x = n.baseX + Math.sin(n.phase) * 14;
        n.y = n.baseY + Math.cos(n.phase * 1.3) * 10;

        const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        g.addColorStop(0, `rgba(110,168,254,${(n.opacity * 0.6).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(110,168,254,${(n.opacity * 0.15).toFixed(3)})`);
        g.addColorStop(1, "rgba(110,168,254,0)");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,210,250,${n.opacity.toFixed(3)})`;
        ctx!.fill();

        if (frame % 6 === 0) n.textOpacity = Math.max(0, n.textOpacity - 0.003);
        if (Math.random() < 0.0008) n.textOpacity = 0.12 + Math.random() * 0.2;
        if (n.textOpacity > 0.005) {
          ctx!.font = "9px 'JetBrains Mono', monospace";
          ctx!.fillStyle = `rgba(110,168,254,${n.textOpacity.toFixed(3)})`;
          ctx!.fillText(n.text, n.x + 8, n.y - 6);
        }
      }

      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const handleClick = () => {
    if (navRef.current) return;
    navRef.current = true;
    setBreaking(true);
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <GlassBreakTransition trigger={breaking} onComplete={() => router.push("/home")} sound />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(6,10,20,0.7) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ zIndex: 2, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />

      <div className={`relative z-10 flex flex-col items-center text-center px-6 py-16 w-full max-w-3xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ marginTop: "calc(10vh - 40px)" }}>
        <div className="text-[11px] tracking-[0.32em] uppercase text-[#6EA8FE]/50 mb-8 font-mono">AI Training · Data Engineering · Systems</div>

        <h1 className="text-4xl font-bold tracking-[0.12em] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] italic" style={{ color: "#E6EAF2", textShadow: "0 0 7px rgba(110,168,254,0.8), 0 0 18px rgba(110,168,254,0.5), 0 0 40px rgba(110,168,254,0.3), 0 0 80px rgba(0,212,255,0.2), 0 0 120px rgba(0,212,255,0.1), 0 2px 4px rgba(0,0,0,0.5)", transform: "skewX(-6deg)", animation: "neon-flicker 3.6s ease-in-out infinite" }}>
          <span style={{ display: "inline-block", transform: "skewX(6deg)" }}>朱 美 阳</span>
        </h1>

        <div className="mt-5 flex items-center gap-4">
          <div className="h-[1px] w-8 bg-[#00D4FF]/30 hidden sm:block" />
          <div className="text-base sm:text-lg tracking-[0.2em] text-[#6EA8FE] font-light">AI训练师 / 大模型数据专家</div>
          <div className="h-[1px] w-8 bg-[#00D4FF]/30 hidden sm:block" />
        </div>

        <p className="mt-8 max-w-lg text-base sm:text-lg leading-[1.8] text-[#8693A8] font-light tracking-[0.03em]">
          我训练的不只是数据，而是
          <span className="italic" style={{ color: "#B0C8E8", fontWeight: 500, textShadow: "0 0 6px rgba(110,168,254,0.7), 0 0 14px rgba(110,168,254,0.4), 0 0 30px rgba(110,168,254,0.2), 0 0 60px rgba(0,212,255,0.12), 0 2px 3px rgba(0,0,0,0.4)", display: "inline-block", transform: "skewX(-4deg)", animation: "neon-flicker 4.2s ease-in-out infinite" }}>
            AI 理解人的方式
          </span>。
        </p>

        <div className="mt-10 flex items-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#6EA8FE]/20" />
          <div className="h-[3px] w-[3px] rounded-full bg-[#00D4FF]/40" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#6EA8FE]/20" />
        </div>

        <button ref={btnRef} onClick={handleClick} disabled={breaking} onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)} className="group relative mt-10 inline-flex items-center gap-3 rounded-full border border-[#6EA8FE]/25 bg-[#6EA8FE]/5 px-8 py-3.5 text-sm font-medium tracking-[0.06em] text-[#B0C8E8] transition-all duration-500 hover:border-[#6EA8FE]/50 hover:bg-[#6EA8FE]/12 hover:text-[#E6EAF2] hover:shadow-[0_0_40px_rgba(110,168,254,0.18)] active:scale-[0.97]">
          <span className={`absolute inset-0 rounded-full transition-opacity duration-700 ${btnHover ? "opacity-100" : "opacity-0"}`} style={{ background: "radial-gradient(circle at center, rgba(110,168,254,0.08) 0%, transparent 70%)" }} />
          <span className="relative z-10">点击进入</span>
          <svg className={`relative z-10 w-4 h-4 transition-transform duration-300 ${btnHover ? "translate-x-1" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <div className="mt-14 text-[10px] tracking-[0.24em] text-[#6EA8FE]/20 uppercase">Personal Brand · AI Trainer</div>
      </div>
    </main>
  );
}
