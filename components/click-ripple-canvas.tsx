"use client";

import { useEffect, useRef } from "react";

interface RippleParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; size: number;
}

interface RippleGroup {
  particles: RippleParticle[];
  ring: { x: number; y: number; r: number; alpha: number; life: number };
}

export function ClickRippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<RippleGroup[]>([]);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = window.innerWidth < 768;
    const onAction = (e: MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if ("touches" in e) {
        if (e.touches.length === 0) return;
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      const particles: RippleParticle[] = [];
      const count = mobile ? 16 : 24;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2 + Math.random() * 2,
        });
      }
      ripplesRef.current.push({
        particles,
        ring: { x: cx, y: cy, r: 0, alpha: 0.3, life: 1 },
      });
    };

    document.addEventListener("click", onAction as EventListener);
    if (mobile) document.addEventListener("touchstart", onAction as EventListener, { passive: true });

    const drawCtx = ctx;

    function draw() {
      drawCtx.clearRect(0, 0, W, H);

      for (let g = ripplesRef.current.length - 1; g >= 0; g--) {
        const group = ripplesRef.current[g];
        let alive = false;

        // Ring
        group.ring.r += 2;
        group.ring.alpha -= 0.006;
        group.ring.life = group.ring.alpha / 0.3;
        if (group.ring.alpha > 0) {
          drawCtx.beginPath();
          drawCtx.arc(group.ring.x, group.ring.y, Math.max(0, group.ring.r), 0, Math.PI * 2);
          drawCtx.strokeStyle = `rgba(59,130,246,${group.ring.alpha.toFixed(3)})`;
          drawCtx.lineWidth = 2 * Math.max(0, group.ring.life);
          drawCtx.stroke();
          alive = true;
        }

        // Particles
        for (const p of group.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life -= 0.015;
          if (p.life > 0) {
            drawCtx.beginPath();
            drawCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            drawCtx.fillStyle = `rgba(59,130,246,${(p.life * 0.8).toFixed(3)})`;
            drawCtx.fill();
            alive = true;
          }
        }

        if (!alive) ripplesRef.current.splice(g, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      document.removeEventListener("click", onAction as EventListener);
      if (mobile) document.removeEventListener("touchstart", onAction as EventListener);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
