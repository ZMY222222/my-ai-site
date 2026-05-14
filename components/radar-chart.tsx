"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { RadarDimension } from "@/data/portfolio-home";

const CHART_SIZE = 340;
const CENTER = CHART_SIZE / 2;
const RADIUS = 135;
const LEVELS = 4;
const ANIM_DURATION = 1200;

export function RadarChart({ data }: { data: RadarDimension[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [dpr, setDpr] = useState(1);
  const dprRef = useRef(1);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const mouseRef = useRef({ x: -999, y: -999 });

  const angles = data.map((_, i) => (Math.PI * 2 * i) / data.length - Math.PI / 2);
  const dots = angles.map((a) => ({ x: CENTER + Math.cos(a) * RADIUS, y: CENTER + Math.sin(a) * RADIUS }));

  useEffect(() => {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    setDpr(d);
    dprRef.current = d;
  }, []);

  const draw = useCallback(
    (progress: number, hoverI: number | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const c = ctx;
      const d = dprRef.current;

      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, CHART_SIZE * d, CHART_SIZE * d);
      c.scale(d, d);

      // Grid circles
      for (let l = 1; l <= LEVELS; l++) {
        const r = (RADIUS / LEVELS) * l;
        c.beginPath();
        c.arc(CENTER, CENTER, r, 0, Math.PI * 2);
        c.strokeStyle = `rgba(255,255,255,${l === LEVELS ? 0.08 : 0.04})`;
        c.lineWidth = 0.5;
        c.stroke();
      }

      // Axis lines
      for (let i = 0; i < data.length; i++) {
        const a = angles[i];
        const isHover = hoverI === i;
        c.beginPath();
        c.moveTo(CENTER, CENTER);
        c.lineTo(CENTER + Math.cos(a) * RADIUS, CENTER + Math.sin(a) * RADIUS);
        c.strokeStyle = isHover ? `${data[i].color}40` : "rgba(255,255,255,0.06)";
        c.lineWidth = isHover ? 1.2 : 0.4;
        c.stroke();
      }

      // Data polygon
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < data.length; i++) {
        const v = (data[i].value / 100) * progress;
        const a = angles[i];
        pts.push({
          x: CENTER + Math.cos(a) * RADIUS * v,
          y: CENTER + Math.sin(a) * RADIUS * v,
        });
      }

      // Fill
      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
      c.closePath();
      c.fillStyle = "rgba(0,212,255,0.1)";
      c.fill();

      // Stroke
      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
      c.closePath();
      c.strokeStyle = "rgba(0,212,255,0.45)";
      c.lineWidth = 1.2;
      c.stroke();

      // Data dots
      for (let i = 0; i < pts.length; i++) {
        const isHover = hoverI === i;
        const r = isHover ? 5.5 : 3;
        c.beginPath();
        c.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2);
        c.fillStyle = data[i].color;
        c.fill();

        // Glow
        const glow = c.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, r * 4);
        glow.addColorStop(0, `${data[i].color}${isHover ? "60" : "25"}`);
        glow.addColorStop(1, `${data[i].color}00`);
        c.beginPath();
        c.arc(pts[i].x, pts[i].y, r * 4, 0, Math.PI * 2);
        c.fillStyle = glow;
        c.fill();
      }

      // Axis labels
      for (let i = 0; i < data.length; i++) {
        const a = angles[i];
        const lr = RADIUS + 22;
        const lx = CENTER + Math.cos(a) * lr;
        const ly = CENTER + Math.sin(a) * lr;
        c.font = "14px 'Space Mono', monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = hoverI === i ? data[i].color : "rgba(255,255,255,0.45)";
        c.fillText(data[i].axis, lx, ly);
      }

      // Value labels
      for (let i = 0; i < pts.length; i++) {
        if (progress < 0.95) continue;
        const p = pts[i];
        const offset = 14;
        const a = angles[i];
        const vx = p.x + Math.cos(a) * offset;
        const vy = p.y + Math.sin(a) * offset;
        c.font = "12px 'Space Mono', monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = hoverI === i ? data[i].color : "rgba(255,255,255,0.3)";
        c.fillText(`${data[i].value}%`, vx, vy);
      }

      // Hover detail text
      if (hoverI !== null && progress >= 0.95) {
        const d = data[hoverI];
        c.font = "12px 'Space Mono', monospace";
        c.textAlign = "center";
        c.textBaseline = "bottom";
        c.fillStyle = d.color;
        c.fillText(d.longName, CENTER, CENTER - 6);

        c.font = "14px 'DM Sans', 'Noto Sans SC', sans-serif";
        c.textBaseline = "top";
        c.fillStyle = "rgba(255,255,255,0.45)";
        c.fillText(d.detail, CENTER, CENTER + 6);
      }
    },
    [data, angles, dots],
  );

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (ts: number) => {
      const elapsed = ts - startTimeRef.current;
      const p = Math.min(1, elapsed / ANIM_DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      progressRef.current = eased;
      draw(eased, hoverIdx);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    if (progressRef.current >= 0.95) {
      draw(progressRef.current, hoverIdx);
    }
  }, [hoverIdx, draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };

      let closest = -1;
      let minDist = Infinity;
      for (let i = 0; i < dots.length; i++) {
        const dx = mx - dots[i].x;
        const dy = my - dots[i].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 28 && d < minDist) {
          minDist = d;
          closest = i;
        }
      }
      setHoverIdx(closest >= 0 ? closest : null);
    },
    [dots],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIdx(null);
  }, []);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={CHART_SIZE * dpr}
        height={CHART_SIZE * dpr}
        className="cursor-crosshair"
        style={{ width: CHART_SIZE, height: CHART_SIZE }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
