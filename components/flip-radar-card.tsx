"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { RadarDimension, ExperienceItem } from "@/data/portfolio-home";

const CARD_H = 420;
const SIZE = 280;
const CX = SIZE / 2;
const RAD = 110;
const LEVELS = 4;
const ANIM = 1200;
const PI = Math.PI;

function RadarCanvas({
  data,
  onHoverIdx,
}: {
  data: RadarDimension[];
  onHoverIdx: (i: number | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const progressRef = useRef(0);
  const hoverRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;

    const angles = data.map((_, i) => (PI * 2 * i) / data.length - PI / 2);

    function draw(progress: number, hi: number | null) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, SIZE, SIZE);

      for (let l = 1; l <= LEVELS; l++) {
        const r = (RAD / LEVELS) * l;
        c.beginPath();
        c.arc(CX, CX, r, 0, PI * 2);
        c.strokeStyle = l === LEVELS ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)";
        c.lineWidth = 0.5;
        c.stroke();
      }

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < data.length; i++) {
        const isHover = hi === i;
        c.beginPath();
        c.moveTo(CX, CX);
        c.lineTo(CX + Math.cos(angles[i]) * RAD, CX + Math.sin(angles[i]) * RAD);
        c.strokeStyle = isHover ? `${data[i].color}40` : "rgba(255,255,255,0.06)";
        c.lineWidth = isHover ? 1 : 0.4;
        c.stroke();

        const v = (data[i].value / 100) * progress;
        pts.push({
          x: CX + Math.cos(angles[i]) * RAD * v,
          y: CX + Math.sin(angles[i]) * RAD * v,
        });
      }

      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
      c.closePath();
      c.fillStyle = "rgba(59,130,246,0.08)";
      c.fill();
      c.strokeStyle = "rgba(59,130,246,0.35)";
      c.lineWidth = 1.2;
      c.stroke();

      for (let i = 0; i < pts.length; i++) {
        const isHover = hi === i;
        const dotR = isHover ? 5 : 2.5;
        const glowR = isHover ? 16 : 10;
        const glowAlpha = isHover ? "50" : "30";

        const glow = c.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, glowR);
        glow.addColorStop(0, `${data[i].color}${glowAlpha}`);
        glow.addColorStop(1, `${data[i].color}00`);
        c.beginPath();
        c.arc(pts[i].x, pts[i].y, glowR, 0, PI * 2);
        c.fillStyle = glow;
        c.fill();

        c.beginPath();
        c.arc(pts[i].x, pts[i].y, dotR, 0, PI * 2);
        c.fillStyle = data[i].color;
        c.fill();
      }

      for (let i = 0; i < data.length; i++) {
        const a = angles[i];
        const lr = RAD + 18;
        c.font = "10px 'Space Mono', monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.35)";
        c.fillText(data[i].axis, CX + Math.cos(a) * lr, CX + Math.sin(a) * lr);
      }

      if (progress >= 0.95) {
        ptsRef.current = pts;
        for (let i = 0; i < pts.length; i++) {
          const a = angles[i];
          c.font = "9px 'Space Mono', monospace";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.25)";
          c.fillText(`${data[i].value}%`, pts[i].x + Math.cos(a) * 12, pts[i].y + Math.sin(a) * 12);
        }
      }
    }

    const started = performance.now();
    function anim(ts: number) {
      const p = Math.min(1, (ts - started) / ANIM);
      const eased = 1 - Math.pow(1 - p, 3);
      progressRef.current = eased;
      draw(eased, hoverRef.current);
      if (p < 1) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }, [data]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const angles = data.map((_, i) => (PI * 2 * i) / data.length - PI / 2);
    const hi = hoverRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    for (let l = 1; l <= LEVELS; l++) {
      const r = (RAD / LEVELS) * l;
      ctx.beginPath();
      ctx.arc(CX, CX, r, 0, PI * 2);
      ctx.strokeStyle = l === LEVELS ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    const pts = angles.map((a, i) => {
      const v = data[i].value / 100;
      return { x: CX + Math.cos(a) * RAD * v, y: CX + Math.sin(a) * RAD * v };
    });
    ptsRef.current = pts;

    for (let i = 0; i < data.length; i++) {
      const isHover = hi === i;
      ctx.beginPath();
      ctx.moveTo(CX, CX);
      ctx.lineTo(CX + Math.cos(angles[i]) * RAD, CX + Math.sin(angles[i]) * RAD);
      ctx.strokeStyle = isHover ? `${data[i].color}40` : "rgba(255,255,255,0.06)";
      ctx.lineWidth = isHover ? 1 : 0.4;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = "rgba(59,130,246,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(59,130,246,0.35)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    for (let i = 0; i < pts.length; i++) {
      const isHover = hi === i;
      const dotR = isHover ? 5 : 2.5;
      const glowR = isHover ? 16 : 10;
      const glowAlpha = isHover ? "50" : "30";
      const glow = ctx.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, glowR);
      glow.addColorStop(0, `${data[i].color}${glowAlpha}`);
      glow.addColorStop(1, `${data[i].color}00`);
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, glowR, 0, PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, dotR, 0, PI * 2);
      ctx.fillStyle = data[i].color;
      ctx.fill();
    }

    for (let i = 0; i < data.length; i++) {
      const a = angles[i];
      ctx.font = "10px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.35)";
      ctx.fillText(data[i].axis, CX + Math.cos(a) * (RAD + 18), CX + Math.sin(a) * (RAD + 18));
    }

    for (let i = 0; i < pts.length; i++) {
      const a = angles[i];
      ctx.font = "9px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.25)";
      ctx.fillText(`${data[i].value}%`, pts[i].x + Math.cos(a) * 12, pts[i].y + Math.sin(a) * 12);
    }
  }, [data]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scaleX = SIZE / rect.width;
      const scaleY = SIZE / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      let closest = -1;
      let minDist = Infinity;
      for (let i = 0; i < ptsRef.current.length; i++) {
        const p = ptsRef.current[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 22 && d < minDist) { minDist = d; closest = i; }
      }
      const newHover = closest >= 0 ? closest : null;
      if (newHover !== hoverRef.current) {
        hoverRef.current = newHover;
        onHoverIdx(newHover);
        redraw();
      }
    },
    [onHoverIdx, redraw],
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverRef.current !== null) {
      hoverRef.current = null;
      onHoverIdx(null);
      redraw();
    }
  }, [onHoverIdx, redraw]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, cursor: "crosshair" }}
        className="block mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoverRef.current !== null && (
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-center" style={{ top: SIZE + 4 }}>
          <div
            className="text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
            style={{
              color: data[hoverRef.current].color,
              background: `${data[hoverRef.current].color}10`,
              border: `0.5px solid ${data[hoverRef.current].color}30`,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {data[hoverRef.current].longName}
          </div>
          <div className="text-[11px] mt-1 max-w-[200px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            {data[hoverRef.current].detail}
          </div>
        </div>
      )}
    </div>
  );
}

export function FlipRadarCard({
  radarData,
  experiences,
}: {
  radarData: RadarDimension[];
  experiences: ExperienceItem[];
}) {
  const [rotY, setRotY] = useState(0);
  const [autoRotating, setAutoRotating] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const rafRef = useRef(0);
  const autoRef = useRef(true);
  const rotRef = useRef(0);

  autoRef.current = autoRotating;
  rotRef.current = rotY;

  const clampedView = ((rotY % 360) + 360) % 360;

  // Auto-rotation loop
  useEffect(() => {
    let lastT = 0;
    const speed = 0.03; // degrees per ms → ~12s for full 360

    function tick(ts: number) {
      if (lastT === 0) lastT = ts;
      const dt = ts - lastT;
      lastT = ts;
      if (autoRef.current) {
        setRotY((prev) => prev + dt * speed);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleClick = useCallback(() => {
    setAutoRotating((prev) => !prev);
    if (autoRotating) {
      // Just stopped → expand detail for the facing side
      setDetailExpanded(true);
    } else {
      setDetailExpanded(false);
    }
  }, [autoRotating]);

  const isFront = clampedView < 90 || clampedView > 270;

  return (
    <div style={{ perspective: 1200 }}>
      <div
        onClick={handleClick}
        style={{
          width: "100%",
          height: CARD_H,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg)`,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Front — Radar */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "rgba(255,255,255,0.015)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <RadarCanvas data={radarData} onHoverIdx={setHoverIdx} />
          <div style={{ minHeight: 52 }}>
            {hoverIdx === null && (
              <p className="text-xs mt-4 text-center max-w-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                {autoRotating ? "🔄 自动旋转中 · 点击暂停查看" : "⏸ 已暂停 · 再次点击继续旋转"}
              </p>
            )}
          </div>
        </div>

        {/* Back — Work Experience */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "rgba(255,255,255,0.015)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: 28,
            flexWrap: "wrap",
          }}
        >
          {experiences.map((exp) => (
            <div key={exp.co} className="flex flex-col items-center gap-3 min-w-[120px]">
              {exp.photo ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxSrc(exp.photo ?? null); }}
                  className="w-[100px] h-[100px] rounded-2xl overflow-hidden border p-0 bg-transparent cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{ borderColor: `${exp.color}30` }}
                  aria-label={`查看${exp.co}照片`}
                >
                  <img
                    src={exp.photo}
                    alt={exp.co}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ) : (
                <div
                  className="w-[100px] h-[100px] rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${exp.color}15` }}
                >
                  {exp.co.slice(0, 1)}
                </div>
              )}
              <div className="text-center">
                <div className="text-sm font-semibold mb-0.5" style={{ color: exp.color }}>
                  {exp.co}
                </div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {exp.role}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)" }}
                >
                  {exp.date}
                </div>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-center w-full mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
            {autoRotating ? "🔄 自动旋转中 · 点击暂停" : "⏸ 已暂停 · 点击继续旋转"}
          </p>
        </div>
      </div>

      {/* Detail panel — shows when auto-rotation is stopped */}
      {detailExpanded && !autoRotating && (
        <div
          className="mt-6 rounded-2xl border overflow-hidden transition-all duration-500"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            animation: "detailSlideIn 0.4s ease-out",
          }}
        >
          {isFront ? (
            /* Front detail: Radar data explained */
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6" }} />
                <span className="text-xs tracking-[2px]" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>
                  项目能力雷达
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {radarData.map((d) => (
                  <div
                    key={d.axis}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-2"
                      style={{ background: d.color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{d.longName}</span>
                        <span className="text-xs font-bold" style={{ color: d.color, fontFamily: "'Space Mono', monospace" }}>
                          {d.value}%
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {d.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Back detail: Work experience full */
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b" }} />
                <span className="text-xs tracking-[2px]" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>
                  工作经历详情
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.co}
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold" style={{ color: exp.color }}>
                        {exp.co}
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {exp.role}
                      </span>
                      <span className="text-[10px] ml-auto" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)" }}>
                        {exp.date}
                      </span>
                    </div>
                    <ul className="space-y-1.5 m-0 pl-4">
                      {exp.points.map((p, i) => (
                        <li key={i} className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status indicator */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={handleClick}
          className="w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-300"
          style={{
            background: isFront ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)",
          }}
          aria-label="项目雷达"
        />
        <div className="w-2 h-2 rounded-full" style={{
          background: autoRotating ? "#3b82f610" : "#3b82f630",
          transition: "all 0.3s",
        }} />
        <button
          onClick={handleClick}
          className="w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-300"
          style={{
            background: !isFront ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)",
          }}
          aria-label="工作经历"
        />
      </div>
      <style>{`
        @keyframes detailSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-8"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors border-0 bg-white/5 cursor-pointer text-xl"
            onClick={() => setLightboxSrc(null)}
            aria-label="关闭"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="照片"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
