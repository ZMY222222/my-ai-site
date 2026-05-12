"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  layer: number;
}

interface RippleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
}

const BG = "#0a0e27";
const PC = [100, 160, 255] as const;
const LC = [80, 130, 220] as const;

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
}

export function ParticleNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rippleRef = useRef<RippleParticle[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const scrollRef = useRef(0);
  const animRef = useRef(0);
  const wRef = useRef(0);
  const hRef = useRef(0);

  function makeParticles(n: number) {
    const W = wRef.current;
    const H = hRef.current;
    const arr: Particle[] = [];
    for (let i = 0; i < n; i++) {
      const layer = Math.floor(Math.random() * 3);
      arr.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.5 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        layer,
      });
    }
    particlesRef.current = arr;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = isMobile();
    const count = mobile ? 60 : 100;

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      const cx = c.getContext("2d");
      if (!cx) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      wRef.current = W;
      hRef.current = H;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.scale(dpr, dpr);
    }

    resize();
    makeParticles(count);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    function onMouseLeave() {
      mouseRef.current.x = -999;
      mouseRef.current.y = -999;
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    }
    function onTouchEnd() {
      mouseRef.current.x = -999;
      mouseRef.current.y = -999;
    }

    // Scroll parallax
    function onScroll() {
      scrollRef.current = window.scrollY;
    }

    // Click ripple
    function onClick(e: MouseEvent) {
      if (mobile) return;
      const cx = e.clientX;
      const cy = e.clientY;
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.3;
        const speed = 1.5 + Math.random() * 3;
        rippleRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random() * 2,
          alpha: 1,
          life: 0,
        });
      }
    }

    window.addEventListener("resize", () => {
      resize();
      makeParticles(count);
    });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    const maxDist = 120;
    const gravStr = 0.05;

    function update() {
      const W = wRef.current;
      const H = hRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scrollY = scrollRef.current;

      // Update particles with scroll parallax
      for (const p of particlesRef.current) {
        if (mx > 0) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200 && d > 1) {
            p.vx += (dx / d) * gravStr * (200 - d) * 0.05;
            p.vy += (dy / d) * gravStr * (200 - d) * 0.05;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }
      }

      // Update ripple particles
      for (let i = rippleRef.current.length - 1; i >= 0; i--) {
        const rp = rippleRef.current[i];
        rp.life += 0.016;
        rp.x += rp.vx;
        rp.y += rp.vy;
        rp.vy += 0.03;
        rp.alpha = Math.max(0, 1 - rp.life / 1.2);
        rp.r *= 0.995;
        if (rp.alpha <= 0) rippleRef.current.splice(i, 1);
      }
    }

    function draw() {
      if (!ctx) return;
      const W = wRef.current;
      const H = hRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = performance.now() * 0.001;
      const scrollY = scrollRef.current;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Draw particles with scroll parallax offset
      for (const p of particlesRef.current) {
        const parallaxSpeed = 0.05 + p.layer * 0.08;
        const offsetY = scrollY * parallaxSpeed;
        const py = p.y + offsetY;
        const wrappedY = ((py % (H + 20)) + H + 20) % (H + 20) - 10;

        const glow = 0.5 + 0.5 * Math.sin(t * 1.5 + p.pulse);
        const alpha = 0.4 + glow * 0.6;
        const r = p.r * (0.8 + glow * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, wrappedY, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PC[0]},${PC[1]},${PC[2]},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Draw particle connections (using wrapped Y)
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const ay = ((a.y + scrollY * (0.05 + a.layer * 0.08)) % (H + 20) + H + 20) % (H + 20) - 10;
          const by = ((b.y + scrollY * (0.05 + b.layer * 0.08)) % (H + 20) + H + 20) % (H + 20) - 10;
          const dx = a.x - b.x;
          const dy = ay - by;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(${LC[0]},${LC[1]},${LC[2]},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      if (mx > 0) {
        for (const p of particlesRef.current) {
          const py = ((p.y + scrollY * (0.05 + p.layer * 0.08)) % (H + 20) + H + 20) % (H + 20) - 10;
          const dx = mx - p.x;
          const dy = my - py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.5;
            ctx.strokeStyle = `rgba(${PC[0]},${PC[1]},${PC[2]},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, py);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PC[0]},${PC[1]},${PC[2]},0.8)`;
        ctx.fill();
      }

      // Click ripple particles
      for (const rp of rippleRef.current) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PC[0]},${PC[1]},${PC[2]},${rp.alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", () => {});
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: -1, pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
