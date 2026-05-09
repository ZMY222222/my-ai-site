"use client";

import { useEffect, useRef } from "react";

const rng = (a: number, b: number) => a + Math.random() * (b - a);

function playSound(file: string) {
  try {
    const a = new Audio(file);
    a.volume = 0.5;
    a.play().catch(() => {});
  } catch {}
}

function turnOffNeons(delayMs: number) {
  const list = document.querySelectorAll("h1[style*=\"textShadow\"], span[style*=\"textShadow\"]");
  list.forEach((el, i) => {
    setTimeout(() => {
      const e = el as HTMLElement;
      e.style.transition = "text-shadow 0.6s, color 0.8s, opacity 0.8s";
      e.style.textShadow = "none"; e.style.color = "#333"; e.style.opacity = "0.2";
    }, delayMs + i * 100);
  });
}

const COLS = 14, ROWS = 10;

interface Props { trigger: boolean; onComplete: () => void; sound?: boolean; }

export function GlassBreakTransition({ trigger, onComplete, sound = false }: Props) {
  const done = useRef(false);

  useEffect(() => {
    if (!trigger) { done.current = false; return; }
    if (done.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { onComplete(); return; }
    done.current = true;

    const W = innerWidth, H = innerHeight;
    const cw = Math.ceil(W / COLS), ch = Math.ceil(H / ROWS);

    if (sound) playSound("/the-sound-of-broken-fragments.mp3");
    turnOffNeons(80);

    const html = document.documentElement;
    const bg = document.createElement("div");
    bg.style.cssText = "position:fixed;inset:0;z-index:99998;background:#060a14;";
    html.appendChild(bg);

    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;top:0;left:0;width:${W}px;height:${H}px;z-index:99999;pointer-events:none;overflow:hidden;`;
    html.appendChild(overlay);

    const rail = document.createElement("div");
    rail.style.cssText = "position:relative;width:100%;height:100%;";
    overlay.appendChild(rail);

    const shards: { el: HTMLCanvasElement; x: number; y: number; vx: number; vy: number; rot: number; rotS: number; life: number; dec: number; delay: number }[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const sx = c * cw, sy = r * ch;
        const sw = cw + 3, shh = ch + 3;
        const el = document.createElement("canvas");
        el.width = sw; el.height = shh;
        const pCtx = el.getContext("2d")!;

        const g = pCtx.createLinearGradient(0, 0, sw * 0.6, shh * 0.7);
        g.addColorStop(0, `rgba(${60+r*8},${90+r*12},${140+r*14},0.92)`);
        g.addColorStop(0.5, `rgba(${30+c*6},${50+r*8},${90+c*10},0.88)`);
        g.addColorStop(1, `rgba(${15+r*4},${25+c*4},${50+r*6},0.95)`);
        pCtx.fillStyle = g;
        pCtx.fillRect(0, 0, sw, shh);

        const rg = pCtx.createLinearGradient(0, 0, sw * 0.4, shh * 0.3);
        rg.addColorStop(0, "rgba(200,220,250,0.12)");
        rg.addColorStop(0.3, "rgba(255,255,255,0.06)");
        rg.addColorStop(0.6, "rgba(255,255,255,0)");
        pCtx.fillStyle = rg;
        pCtx.fillRect(0, 0, sw, shh);

        pCtx.strokeStyle = "rgba(220,240,255,0.25)";
        pCtx.lineWidth = 0.8;
        pCtx.strokeRect(0.4, 0.4, sw - 0.8, shh - 0.8);

        el.style.cssText = `position:absolute;left:${sx}px;top:${sy}px;width:${sw}px;height:${shh}px;transform-origin:center center;`;
        rail.appendChild(el);

        const mx = sx + sw / 2, my = sy + shh / 2;
        const dist = Math.sqrt((mx - W / 2) ** 2 + (my - H / 2) ** 2);

        shards.push({
          el, x: sx, y: sy,
          vx: rng(-3.5, 3.5), vy: rng(-1, 1), rot: 0, rotS: rng(-0.13, 0.13),
          life: 1, dec: rng(0.012, 0.025), delay: dist / 18,
        });
      }
    }

    // Hide body content immediately
    document.body.style.visibility = "hidden";

    function finish() {
      document.body.style.visibility = "";
      onComplete();
      setTimeout(() => {
        [overlay, bg].forEach(e => { if (e.parentNode) e.parentNode.removeChild(e); });
      }, 200);
    }

    const safety = setTimeout(() => {
      document.body.style.visibility = "";
      onComplete();
      setTimeout(() => {
        [overlay, bg].forEach(e => { if (e.parentNode) e.parentNode.removeChild(e); });
      }, 200);
    }, 1200);

    let t0 = 0;
    function frame(ts: number) {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;
      let allGone = true;
      for (const s of shards) {
        const dt = Math.max(0, elapsed - s.delay);
        if (dt <= 0) { allGone = false; continue; }
        s.life -= s.dec;
        if (s.life <= 0) { s.el.style.display = "none"; continue; }
        allGone = false;
        s.vy += 0.14; s.vx *= 0.994;
        s.x += s.vx; s.y += s.vy;
        s.rot += s.rotS;
        s.el.style.opacity = `${Math.max(0, s.life)}`;
        s.el.style.transform = `translate(${s.x - (parseFloat(s.el.style.left) || 0)}px, ${s.y - (parseFloat(s.el.style.top) || 0)}px) rotate(${s.rot}rad)`;
      }
      if (allGone) { clearTimeout(safety); finish(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [trigger, onComplete, sound]);

  return null;
}
