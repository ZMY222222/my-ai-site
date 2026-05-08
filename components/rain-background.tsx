"use client";

import { useEffect, useRef } from "react";

/* ---------- types ---------- */
interface RainStreak {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
}
interface Drop {
  x: number;
  y: number;
  r: number;
  maxR: number;
  opacity: number;
  trail: { x: number; y: number; r: number; opacity: number }[];
  phase: "growing" | "sliding" | "fading";
  speed: number;
}

/* ---------- component ---------- */
export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    let streaks: RainStreak[] = [];
    let drops: Drop[] = [];
    const MAX_STREAKS = 140;
    const MAX_DROPS = 25;
    let animId = 0;
    let spawnTickDrop = 0;

    initStreaks();
    initDrops();

    function initStreaks() {
      streaks = [];
      for (let i = 0; i < MAX_STREAKS; i++) {
        streaks.push(createStreak(Math.random() * window.innerHeight));
      }
    }

    function createStreak(y?: number): RainStreak {
      return {
        x: Math.random() * (window.innerWidth + 60) - 30,
        y: y ?? -Math.random() * window.innerHeight,
        length: 8 + Math.random() * 22,
        speed: 4 + Math.random() * 10,
        opacity: 0.06 + Math.random() * 0.12,
        thickness: 0.4 + Math.random() * 0.8,
      };
    }

    function initDrops() {
      drops = [];
      for (let i = 0; i < MAX_DROPS; i++) {
        drops.push(createDrop());
        drops[i].y = Math.random() * window.innerHeight;
        drops[i].phase = Math.random() > 0.5 ? "sliding" : "fading";
        if (drops[i].phase === "sliding") {
          drops[i].r = drops[i].maxR;
          drops[i].opacity = 0.12 + Math.random() * 0.08;
        }
      }
    }

    function createDrop(): Drop {
      return {
        x: Math.random() * window.innerWidth,
        y: -10,
        r: 0.15,
        maxR: 1.2 + Math.random() * 2.4,
        opacity: 0.04 + Math.random() * 0.06,
        trail: [],
        phase: "growing",
        speed: 0.4 + Math.random() * 1.2,
      };
    }

    function resize() {
      const c2 = canvasRef.current;
      if (!c2) return;
      const cx = c2.getContext("2d");
      if (!cx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c2.width = window.innerWidth * dpr;
      c2.height = window.innerHeight * dpr;
      c2.style.width = `${window.innerWidth}px`;
      c2.style.height = `${window.innerHeight}px`;
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.scale(dpr, dpr);
    }

    function update() {
      for (const s of streaks) {
        s.y += s.speed;
        s.x += s.speed * 0.03 * (Math.random() - 0.5) * 0.3;
        if (s.y > window.innerHeight + s.length) {
          Object.assign(s, createStreak(-s.length));
        }
      }

      spawnTickDrop++;
      if (spawnTickDrop >= 40) {
        spawnTickDrop = 0;
        const alive = drops.filter((d) => d.phase === "growing");
        if (alive.length < 6 && drops.length < MAX_DROPS + 5) {
          drops.push(createDrop());
        }
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (d.phase === "growing") {
          d.r += 0.12;
          d.opacity += 0.003;
          if (d.opacity > 0.2) d.opacity = 0.2;
          if (d.r >= d.maxR) d.phase = Math.random() > 0.65 ? "sliding" : "fading";
        } else if (d.phase === "sliding") {
          d.trail.push({ x: d.x, y: d.y, r: d.r * 0.55, opacity: d.opacity * 0.4 });
          if (d.trail.length > 22) d.trail.shift();
          d.y += d.speed;
          d.opacity -= 0.00015;
          d.r -= 0.002;
          for (const t of d.trail) {
            t.y += d.speed * 0.97;
            t.opacity -= 0.007;
            t.r -= 0.008;
          }
        } else {
          d.opacity -= 0.006;
          d.r += 0.03;
        }
        if (d.y > window.innerHeight + 30 || d.opacity <= 0) drops.splice(i, 1);
      }
    }

    function draw() {
      c.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of streaks) {
        if (s.opacity <= 0) continue;
        c.beginPath();
        c.moveTo(s.x, s.y);
        const endX = s.x + s.speed * 0.04 * (Math.random() - 0.5) * 0.5;
        c.lineTo(endX, s.y + s.length);
        c.strokeStyle = `rgba(190,210,230,${s.opacity.toFixed(3)})`;
        c.lineWidth = s.thickness;
        c.lineCap = "round";
        c.stroke();
      }
      for (const d of drops) {
        for (const t of d.trail) {
          if (t.opacity <= 0 || t.r <= 0.05) continue;
          c.beginPath();
          c.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          c.fillStyle = `rgba(185,205,220,${t.opacity.toFixed(3)})`;
          c.fill();
        }
        if (d.opacity <= 0 || d.r <= 0.05) continue;
        c.beginPath();
        c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        const g = c.createRadialGradient(
          d.x - d.r * 0.2, d.y - d.r * 0.25, d.r * 0.04,
          d.x, d.y, d.r,
        );
        g.addColorStop(0, `rgba(215,230,245,${(d.opacity * 1.4).toFixed(3)})`);
        g.addColorStop(0.45, `rgba(175,200,220,${d.opacity.toFixed(3)})`);
        g.addColorStop(1, `rgba(135,160,185,${(d.opacity * 0.3).toFixed(3)})`);
        c.fillStyle = g;
        c.fill();
      }
    }

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    resize();
    const onResize = () => { resize(); initStreaks(); initDrops(); };
    window.addEventListener("resize", onResize);
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0" style={{ zIndex: -999, pointerEvents: "none" }}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/beijing.png)", filter: "brightness(0.72) saturate(0.85)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,4,8,0.55) 100%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />
    </div>
  );
}
