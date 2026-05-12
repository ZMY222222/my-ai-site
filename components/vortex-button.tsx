"use client";

import { useEffect, useRef, useCallback } from "react";

const BUTTON_RADIUS = 50;
const SPIRAL_EXTEND = 60;
const WATER_PARTICLES = 120;
const FOAM_PARTICLES = 25;
const SPLASH_PARTICLES = 30;
const RIPPLE_COUNT = 3;
const MAIN = "56,189,248";
const FOAM = "224,242,254";

interface SplashDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function VortexButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(false);
  const splashesRef = useRef<SplashDrop[]>([]);
  const timeRef = useRef(0);
  const speedRef = useRef(1);
  const ripplePhaseRef = useRef(0);
  const clickedRef = useRef(false);

  const size = (BUTTON_RADIUS + SPIRAL_EXTEND) * 2 + 20;
  const half = size / 2;

  const handleClick = useCallback(() => {
    if (disabled || clickedRef.current) return;
    clickedRef.current = true;

    for (let i = 0; i < SPLASH_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - Math.random() * 2;
      splashesRef.current.push({
        x: half + Math.cos(angle) * BUTTON_RADIUS,
        y: half + Math.sin(angle) * BUTTON_RADIUS,
        vx,
        vy,
        r: 1 + Math.random() * 2.5,
        alpha: 1,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }

    setTimeout(() => onClick(), 120);
  }, [disabled, onClick, half]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.scale(dpr, dpr);

    let animId = 0;

    function drawGlowRing(r: number, alpha: number) {
      const grad = c.createRadialGradient(half, half, r * 0.92, half, half, r * 1.12);
      grad.addColorStop(0, `rgba(${MAIN},0)`);
      grad.addColorStop(0.45, `rgba(${MAIN},${(alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(0.7, `rgba(${MAIN},${(alpha * 0.7).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${MAIN},0)`);
      c.beginPath();
      c.arc(half, half, r * 1.12, 0, Math.PI * 2);
      c.fillStyle = grad;
      c.fill();
    }

    function drawSpirals(time: number, speedMul: number) {
      for (let i = 0; i < 5; i++) {
        const baseOffset = (i * Math.PI * 2) / 5;
        const steps = 80;
        c.beginPath();
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const r = BUTTON_RADIUS + t * SPIRAL_EXTEND;
          const angle = baseOffset + time * 0.02 * speedMul + t * Math.PI * 1.4;
          const x = half + Math.cos(angle) * r;
          const y = half + Math.sin(angle) * r;
          if (j === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.strokeStyle = `rgba(${MAIN},0.22)`;
        c.lineWidth = 0.8;
        c.stroke();
      }
    }

    function drawRipples(phase: number, speedMul: number) {
      for (let i = 0; i < RIPPLE_COUNT; i++) {
        const offset = i * 0.8;
        let t = (phase + offset) % (0.8 * RIPPLE_COUNT);
        t = t / 0.8;
        if (t > 1) continue;
        if (speedMul > 1) t = Math.min(1, t * speedMul);
        const r = BUTTON_RADIUS + t * 20;
        const alpha = (1 - t) * 0.35;
        const grad = c.createRadialGradient(half, half, r - 2, half, half, r + 2);
        grad.addColorStop(0, `rgba(${MAIN},0)`);
        grad.addColorStop(0.4, `rgba(${MAIN},${(alpha * 0.6).toFixed(3)})`);
        grad.addColorStop(0.6, `rgba(${MAIN},${alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${MAIN},0)`);
        c.beginPath();
        c.arc(half, half, r + 2, 0, Math.PI * 2);
        c.fillStyle = grad;
        c.fill();
      }
    }

    function drawWaterParticles(time: number, speedMul: number, pullIn: number) {
      for (let i = 0; i < WATER_PARTICLES; i++) {
        const layer = i < 40 ? 0 : i < 80 ? 1 : 2;
        const layerSpeed = layer === 0 ? 0.025 : layer === 1 ? 0.016 : 0.010;
        const baseRadiusMin = layer === 0 ? 52 : layer === 1 ? 60 : 78;
        const baseRadiusMax = layer === 0 ? 66 : layer === 1 ? 86 : 112;
        const seed = i * 137.5;
        const baseR = baseRadiusMin + (seed % 100) / 100 * (baseRadiusMax - baseRadiusMin);
        const r = baseR - pullIn;
        const angle = seed * 0.01 + time * layerSpeed * speedMul;
        const wobble = Math.sin(time * 0.04 + seed * 0.1) * (layer === 0 ? 3 : layer === 1 ? 2.5 : 2);
        const cr = r + wobble;
        const h = 190 + (seed % 31);
        const s = 70 + (seed % 25);
        const l = 60 + (seed % 25);
        const blink = 0.5 + Math.sin(time * 0.06 + seed * 0.2) * 0.3 + Math.sin(time * 0.13 + seed) * 0.2;
        const alpha = Math.max(0.15, Math.min(0.7, blink));
        const size = layer === 0 ? 2 : layer === 1 ? 1.6 : 1.2;

        const x = half + Math.cos(angle) * cr;
        const y = half + Math.sin(angle) * cr;

        if (layer === 0) {
          const trailAngle = angle - 0.12 * speedMul;
          const tx = half + Math.cos(trailAngle) * cr;
          const ty = half + Math.sin(trailAngle) * cr;
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(tx, ty);
          c.strokeStyle = `rgba(${MAIN},${(alpha * 0.4).toFixed(3)})`;
          c.lineWidth = size * 0.8;
          c.stroke();
        }

        c.beginPath();
        c.arc(x, y, size, 0, Math.PI * 2);
        c.fillStyle = `hsla(${h},${s}%,${l}%,${alpha.toFixed(3)})`;
        c.fill();
      }
    }

    function drawFoam(time: number, speedMul: number) {
      for (let i = 0; i < FOAM_PARTICLES; i++) {
        const seed = i * 97.3;
        const angle = seed * 0.02 + time * 0.06 * speedMul;
        const baseR = BUTTON_RADIUS - 3 + (seed % 10) / 10 * 6;
        const bounce = Math.sin(time * 0.08 + seed * 0.3) * 2.5;
        const r = baseR + bounce;
        const x = half + Math.cos(angle) * r;
        const y = half + Math.sin(angle) * r;
        const blink = 0.4 + Math.sin(time * 0.1 + seed) * 0.4;
        const alpha = Math.max(0.1, Math.min(0.8, blink));
        const size = 0.8 + (seed % 10) / 10 * 1.8;
        c.beginPath();
        c.arc(x, y, size, 0, Math.PI * 2);
        c.fillStyle = `rgba(${FOAM},${alpha.toFixed(3)})`;
        c.fill();
      }
    }

    function drawSplashes() {
      for (let i = splashesRef.current.length - 1; i >= 0; i--) {
        const d = splashesRef.current[i];
        d.life += 0.016;
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.04;
        d.alpha = Math.max(0, 1 - d.life / d.maxLife);
        d.r *= 0.995;
        if (d.alpha <= 0) {
          splashesRef.current.splice(i, 1);
          continue;
        }
        c.beginPath();
        c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        c.fillStyle = `rgba(${FOAM},${d.alpha.toFixed(3)})`;
        c.fill();
      }
    }

    function loop() {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const targetSpeed = hoverRef.current ? 5 : 1;
      speedRef.current += (targetSpeed - speedRef.current) * 0.15;
      const speedMul = speedRef.current;
      const pullIn = hoverRef.current ? (speedRef.current - 1) / 1.8 * 3 : 0;
      ripplePhaseRef.current += 0.016 * speedMul;

      c.clearRect(0, 0, size, size);

      drawGlowRing(BUTTON_RADIUS, 0.5 + Math.sin(t * 0.025) * 0.2);
      drawSpirals(t, speedMul);
      drawRipples(ripplePhaseRef.current, speedMul);
      drawWaterParticles(t, speedMul, pullIn);
      drawFoam(t, speedMul);
      drawSplashes();

      drawGlowRing(BUTTON_RADIUS, 0.2);

      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => cancelAnimationFrame(animId);
  }, [size, half]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="absolute inset-0 flex items-center justify-center bg-transparent border-0 cursor-pointer outline-none select-none"
        style={{ zIndex: 1 }}
        aria-label="点击进入"
      >
        <span
          className="text-sm font-medium tracking-[0.08em] transition-opacity duration-300"
          style={{
            color: "#e0f2fe",
            textShadow: "0 0 10px rgba(56,189,248,0.7), 0 0 25px rgba(56,189,248,0.35), 0 0 50px rgba(56,189,248,0.15)",
          }}
        >
          点击进入
        </span>
      </button>
    </div>
  );
}
