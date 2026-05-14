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

const AC = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

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
        c.strokeStyle = l === LEVELS ? `${AC[0]}30` : `${AC[4]}18`;
        c.lineWidth = l === LEVELS ? 2 : 1;
        c.setLineDash(l === LEVELS ? [] : [4, 4]);
        c.stroke();
        c.setLineDash([]);
      }

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < data.length; i++) {
        const isHover = hi === i;
        c.beginPath();
        c.moveTo(CX, CX);
        c.lineTo(CX + Math.cos(angles[i]) * RAD, CX + Math.sin(angles[i]) * RAD);
        c.strokeStyle = isHover ? `${data[i].color}80` : `${AC[4]}25`;
        c.lineWidth = isHover ? 2 : 1;
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
      c.fillStyle = `${AC[0]}20`;
      c.fill();
      c.strokeStyle = AC[0];
      c.lineWidth = 2.5;
      c.stroke();

      for (let i = 0; i < pts.length; i++) {
        const isHover = hi === i;
        const dotR = isHover ? 7 : 4;
        const glowR = isHover ? 24 : 16;

        const glow = c.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, glowR);
        glow.addColorStop(0, `${data[i].color}80`);
        glow.addColorStop(1, `${data[i].color}00`);
        c.beginPath();
        c.arc(pts[i].x, pts[i].y, glowR, 0, PI * 2);
        c.fillStyle = glow;
        c.fill();

        c.beginPath();
        c.arc(pts[i].x, pts[i].y, dotR, 0, PI * 2);
        c.fillStyle = data[i].color;
        c.fill();
        c.strokeStyle = "#FFFFFF";
        c.lineWidth = 2;
        c.stroke();
      }

      for (let i = 0; i < data.length; i++) {
        const a = angles[i];
        const lr = RAD + 22;
        c.font = "bold 14px 'Outfit', 'Space Mono', monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.7)";
        c.fillText(data[i].axis, CX + Math.cos(a) * lr, CX + Math.sin(a) * lr);
      }

      if (progress >= 0.95) {
        ptsRef.current = pts;
        for (let i = 0; i < pts.length; i++) {
          const a = angles[i];
          c.font = "bold 12px 'Space Mono', monospace";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillStyle = hi === i ? "#FFFFFF" : data[i].color;
          c.fillText(`${data[i].value}%`, pts[i].x + Math.cos(a) * 15, pts[i].y + Math.sin(a) * 15);
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
      ctx.strokeStyle = l === LEVELS ? `${AC[0]}30` : `${AC[4]}18`;
      ctx.lineWidth = l === LEVELS ? 2 : 1;
      ctx.setLineDash(l === LEVELS ? [] : [4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
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
      ctx.strokeStyle = isHover ? `${data[i].color}80` : `${AC[4]}25`;
      ctx.lineWidth = isHover ? 2 : 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = `${AC[0]}20`;
    ctx.fill();
    ctx.strokeStyle = AC[0];
    ctx.lineWidth = 2.5;
    ctx.stroke();

    for (let i = 0; i < pts.length; i++) {
      const isHover = hi === i;
      const dotR = isHover ? 7 : 4;
      const glowR = isHover ? 24 : 16;
      const glow = ctx.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, glowR);
      glow.addColorStop(0, `${data[i].color}80`);
      glow.addColorStop(1, `${data[i].color}00`);
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, glowR, 0, PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, dotR, 0, PI * 2);
      ctx.fillStyle = data[i].color;
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (let i = 0; i < data.length; i++) {
      const a = angles[i];
      ctx.font = "bold 14px 'Outfit', 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hi === i ? data[i].color : "rgba(255,255,255,0.7)";
      ctx.fillText(data[i].axis, CX + Math.cos(a) * (RAD + 22), CX + Math.sin(a) * (RAD + 22));
    }

    for (let i = 0; i < pts.length; i++) {
      const a = angles[i];
      ctx.font = "bold 12px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hi === i ? "#FFFFFF" : data[i].color;
      ctx.fillText(`${data[i].value}%`, pts[i].x + Math.cos(a) * 15, pts[i].y + Math.sin(a) * 15);
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
            className="text-xs px-4 py-2 rounded-xl whitespace-nowrap font-bold border-2"
            style={{
              color: data[hoverRef.current].color,
              background: `${data[hoverRef.current].color}15`,
              borderColor: data[hoverRef.current].color,
              fontFamily: "'Space Mono', monospace",
              boxShadow: `4px 4px 0 ${AC[2]}`,
            }}
          >
            {data[hoverRef.current].longName}
          </div>
          <div className="text-[11px] mt-2 max-w-[200px] leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
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

  useEffect(() => {
    let lastT = 0;
    const speed = 0.03;

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "#2D1B4E80",
            border: `4px solid ${AC[1]}`,
            borderRadius: 24,
            boxShadow: `8px 8px 0 ${AC[0]}, 16px 16px 0 ${AC[2]}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(8px)",
          }}
        >
          <RadarCanvas data={radarData} onHoverIdx={setHoverIdx} />
          <div style={{ minHeight: 52 }}>
            {hoverIdx === null && (
              <p
                className="text-xs mt-4 text-center max-w-xs font-bold"
                style={{
                  color: AC[1],
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {autoRotating ? "🔄 自动旋转中 · 点击暂停查看" : "⏸ 已暂停 · 再次点击继续旋转"}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#2D1B4E80",
            border: `4px solid ${AC[3]}`,
            borderRadius: 24,
            boxShadow: `8px 8px 0 ${AC[4]}, 16px 16px 0 ${AC[2]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: 28,
            flexWrap: "wrap",
            backdropFilter: "blur(8px)",
          }}
        >
          {experiences.map((exp, idx) => (
            <div key={exp.co} className="flex flex-col items-center gap-3 min-w-[120px]">
              {exp.photo ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxSrc(exp.photo ?? null); }}
                  className="w-[100px] h-[100px] rounded-2xl overflow-hidden p-0 bg-transparent cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    border: `4px solid ${AC[idx % 5]}`,
                    borderStyle: idx % 2 === 0 ? "solid" : "dashed",
                    boxShadow: `4px 4px 0 ${AC[(idx + 2) % 5]}`,
                  }}
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
                  className="w-[100px] h-[100px] rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{
                    background: `${exp.color}20`,
                    border: `4px dashed ${exp.color}`,
                    boxShadow: `4px 4px 0 ${AC[(idx + 2) % 5]}`,
                  }}
                >
                  {exp.co.slice(0, 1)}
                </div>
              )}
              <div className="text-center">
                <div className="text-sm font-black mb-0.5" style={{ color: exp.color, textShadow: `0 0 8px ${exp.color}60` }}>
                  {exp.co}
                </div>
                <div className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {exp.role}
                </div>
                <div
                  className="text-[10px] mt-0.5 font-bold"
                  style={{ fontFamily: "'Space Mono', monospace", color: AC[idx % 5] }}
                >
                  {exp.date}
                </div>
              </div>
            </div>
          ))}
          <p
            className="text-[11px] text-center w-full mt-2 font-bold"
            style={{ color: AC[3], fontFamily: "'Space Mono', monospace" }}
          >
            {autoRotating ? "🔄 自动旋转中 · 点击暂停" : "⏸ 已暂停 · 点击继续旋转"}
          </p>
        </div>
      </div>

      {detailExpanded && !autoRotating && (
        <div
          className="mt-6 rounded-3xl overflow-hidden transition-all duration-500"
          style={{
            border: `4px solid ${isFront ? AC[1] : AC[3]}`,
            borderStyle: "dashed",
            background: "#2D1B4E80",
            boxShadow: `8px 8px 0 ${isFront ? AC[2] : AC[0]}`,
            animation: "detailSlideIn 0.4s ease-out",
            backdropFilter: "blur(8px)",
          }}
        >
          {isFront ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-3 h-8 rounded-full"
                  style={{ background: AC[1] }}
                />
                <span
                  className="text-sm tracking-[2px] font-black uppercase"
                  style={{ fontFamily: "'Space Mono', monospace", color: AC[1] }}
                >
                  项目能力雷达
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {radarData.map((d, i) => (
                  <div
                    key={d.axis}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{
                      background: `${d.color}10`,
                      border: `3px solid ${d.color}`,
                      borderStyle: i % 2 === 0 ? "solid" : "dashed",
                      boxShadow: `4px 4px 0 ${AC[(i + 2) % 5]}`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-1.5"
                      style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{d.longName}</span>
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded-full border-2"
                          style={{
                            color: d.color,
                            borderColor: d.color,
                            background: `${d.color}15`,
                            fontFamily: "'Space Mono', monospace",
                          }}
                        >
                          {d.value}%
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {d.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-3 h-8 rounded-full"
                  style={{ background: AC[3] }}
                />
                <span
                  className="text-sm tracking-[2px] font-black uppercase"
                  style={{ fontFamily: "'Space Mono', monospace", color: AC[3] }}
                >
                  工作经历详情
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {experiences.map((exp, i) => (
                  <div
                    key={exp.co}
                    className="p-5 rounded-2xl"
                    style={{
                      background: `${exp.color}10`,
                      border: `3px solid ${exp.color}`,
                      borderStyle: i % 2 === 0 ? "solid" : "dashed",
                      boxShadow: `4px 4px 0 ${AC[(i + 2) % 5]}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-base font-black" style={{ color: exp.color, textShadow: `0 0 8px ${exp.color}60` }}>
                        {exp.co}
                      </span>
                      <span
                        className="text-[11px] font-bold px-3 py-1 rounded-full border-2"
                        style={{ color: AC[(i + 1) % 5], borderColor: AC[(i + 1) % 5], background: `${AC[(i + 1) % 5]}15` }}
                      >
                        {exp.role}
                      </span>
                      <span
                        className="text-[10px] ml-auto font-bold"
                        style={{ fontFamily: "'Space Mono', monospace", color: AC[(i + 3) % 5] }}
                      >
                        {exp.date}
                      </span>
                    </div>
                    <ul className="space-y-2 m-0 pl-4">
                      {exp.points.map((p, j) => (
                        <li
                          key={j}
                          className="text-[12px] leading-relaxed font-medium"
                          style={{ color: "rgba(255,255,255,0.65)" }}
                        >
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

      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={handleClick}
          className="w-3 h-3 rounded-full border-2 cursor-pointer transition-all duration-300"
          style={{
            background: isFront ? AC[1] : "transparent",
            borderColor: AC[1],
            boxShadow: isFront ? `0 0 8px ${AC[1]}` : "none",
          }}
          aria-label="项目雷达"
        />
        <div
          className="w-3 h-3 rounded-full border-2"
          style={{
            background: autoRotating ? `${AC[0]}30` : AC[0],
            borderColor: AC[0],
            boxShadow: !autoRotating ? `0 0 8px ${AC[0]}` : "none",
            transition: "all 0.3s",
          }}
        />
        <button
          onClick={handleClick}
          className="w-3 h-3 rounded-full border-2 cursor-pointer transition-all duration-300"
          style={{
            background: !isFront ? AC[3] : "transparent",
            borderColor: AC[3],
            boxShadow: !isFront ? `0 0 8px ${AC[3]}` : "none",
          }}
          aria-label="工作经历"
        />
      </div>
      <style>{`
        @keyframes detailSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-8"
          style={{ background: "rgba(13,13,26,0.92)", backdropFilter: "blur(16px)" }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center text-white cursor-pointer text-xl font-black"
            style={{
              background: "#2D1B4E",
              border: `3px solid ${AC[0]}`,
              boxShadow: `4px 4px 0 ${AC[2]}`,
            }}
            onClick={() => setLightboxSrc(null)}
            aria-label="关闭"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="照片"
            className="max-w-full max-h-[85vh] object-contain"
            style={{
              borderRadius: 24,
              border: `4px solid ${AC[0]}`,
              boxShadow: `12px 12px 0 ${AC[4]}, 24px 24px 0 ${AC[2]}`,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
