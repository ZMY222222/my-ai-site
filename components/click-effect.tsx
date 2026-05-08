"use client";

import { useEffect } from "react";

const DOT_COLORS = ["#6EA8FE", "#6EA8FE", "#8B7CFF", "#8B7CFF", "#A78BFA", "#E6EAF2", "#6EA8FE"];
const AI_SYMBOLS = ["<>", "{}", "//", "AI"];
const DOT_COUNT = 7;
const MAX_DISTANCE = 120;
const DURATION = 900;
const THROTTLE_MS = 80;

let lastClick = 0;

function createDot(x: number, y: number, angle: number, distance: number, color: string) {
  const el = document.createElement("div");
  const size = 5 + Math.random() * 3;

  el.style.cssText = `
    position:fixed;
    left:${x}px;
    top:${y}px;
    width:${size}px;
    height:${size}px;
    border-radius:50%;
    background:${color};
    pointer-events:none;
    z-index:9998;
    transform:translate(-50%,-50%) scale(0);
    opacity:1;
    will-change:transform,opacity;
  `;

  document.body.appendChild(el);
  animateParticle(el, x, y, angle, distance, false);
}

function createSymbol(x: number, y: number, angle: number, distance: number, color: string) {
  const el = document.createElement("div");
  const symbol = AI_SYMBOLS[Math.floor(Math.random() * AI_SYMBOLS.length)];

  el.style.cssText = `
    position:fixed;
    left:${x}px;
    top:${y}px;
    color:${color};
    font-size:11px;
    font-weight:500;
    font-family:"JetBrains Mono","Fira Code",monospace;
    pointer-events:none;
    z-index:9998;
    transform:translate(-50%,-50%) scale(0);
    opacity:1;
    will-change:transform,opacity;
    white-space:nowrap;
    line-height:1;
  `;
  el.textContent = symbol;

  document.body.appendChild(el);
  animateParticle(el, x, y, angle, distance, true);
}

function animateParticle(el: HTMLElement, x: number, y: number, angle: number, distance: number, isSymbol: boolean) {
  const start = performance.now();
  const dur = DURATION + (Math.random() - 0.5) * 160;
  const rad = (angle * Math.PI) / 180;
  const targetX = Math.cos(rad) * distance;
  const targetY = Math.sin(rad) * distance;

  const animate = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / dur);
    const ease = 1 - (1 - t) ** 3;
    const tx = targetX * ease;
    const ty = targetY * ease + t * 6;
    const scale = isSymbol ? (1 - t * 0.25) : (0.7 + 0.3 * (1 - t));
    const opacity = 1 - t;

    el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
    el.style.opacity = String(opacity);

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      el.remove();
    }
  };

  requestAnimationFrame(animate);
}

function spawnParticles(x: number, y: number) {
  const now = Date.now();
  if (now - lastClick < THROTTLE_MS) return;
  lastClick = now;

  const symbolCount = Math.random() < 0.5 ? 1 : 2;
  const total = DOT_COUNT + symbolCount;

  for (let i = 0; i < total; i++) {
    const angle = (360 / total) * i + (Math.random() - 0.5) * 44;
    const distance = 36 + Math.random() * (MAX_DISTANCE - 36);
    const color = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];

    if (i >= DOT_COUNT) {
      createSymbol(x, y, angle, distance * 0.65, color);
    } else {
      createDot(x, y, angle, distance, color);
    }
  }
}

export function ClickEffect() {
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "touch" && e.pointerType !== "pen") return;
      spawnParticles(e.clientX, e.clientY);
    };

    document.addEventListener("pointerdown", handler);

    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, []);

  return null;
}
