"use client";

import { useRef, useCallback, useEffect } from "react";

const COLORS = ["#FFD700", "#FFA500", "#FF6347", "#FF69B4", "#E6E6FA", "#FFFACD", "#F0E68C"];

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; decay: number;
  color: string;
  rotation: number; rotSpeed: number;
  outerR: number; innerR: number;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function playWelcome() {
  try {
    const a = new Audio("/ttsmaker-file-2026-5-9-20-0-36.mp3");
    a.volume = 0.5;
    a.play().catch(() => {});
  } catch {}
}

export function StarClickEffect({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const dprRef = useRef(2);
  const sizeRef = useRef({ w: 0, h: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef(0);

  const emit = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left + 60;
    const y = clientY - rect.top + 60;

    const count = 35 + Math.floor(Math.random() * 16);
    const newSparks: Spark[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 7;
      const outerR = 5 + Math.random() * 14;
      newSparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2.5,
        life: 1,
        decay: 0.005 + Math.random() * 0.012,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        outerR,
        innerR: outerR * (0.3 + Math.random() * 0.25),
      });
    }
    sparksRef.current.push(...newSparks);
    playWelcome();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;

    const resize = () => {
      const r = container.getBoundingClientRect();
      const pad = 60;
      sizeRef.current = { w: r.width + pad * 2, h: r.height + pad * 2 };
      canvas.width = (r.width + pad * 2) * dpr;
      canvas.height = (r.height + pad * 2) * dpr;
      canvas.style.width = `${r.width + pad * 2}px`;
      canvas.style.height = `${r.height + pad * 2}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function tick() {
      const { w, h } = sizeRef.current;
      const dr = dprRef.current;
      ctx.save(); ctx.setTransform(dr, 0, 0, dr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.restore();

      const all = sparksRef.current;
      for (let i = all.length - 1; i >= 0; i--) {
        const s = all[i];
        s.life -= s.decay;
        if (s.life <= 0) { all.splice(i, 1); continue; }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.rotation += s.rotSpeed;
        s.outerR *= 0.998;
        s.innerR *= 0.998;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        drawStar(ctx, 0, 0, s.outerR, s.innerR);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  // Use native event listener for reliability
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      emit(e.clientX, e.clientY);
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [emit]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center justify-center" style={{ cursor: "pointer" }}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute" style={{ pointerEvents: "none", zIndex: 20, top: "-60px", left: "-60px", width: "calc(100% + 120px)", height: "calc(100% + 120px)" }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
