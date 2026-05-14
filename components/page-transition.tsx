"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentProps } from "react";

const DURATION = 700;
const EXIT_DURATION = 350;

let overlayEl: HTMLDivElement | null = null;
let breathEl: HTMLDivElement | null = null;
let barEl: HTMLDivElement | null = null;
let pctEl: HTMLDivElement | null = null;
let exitTimer: ReturnType<typeof setTimeout> | null = null;
let rafId = 0;
let showedAt = 0;

function ensureOverlay() {
  if (overlayEl) return;

  overlayEl = document.createElement("div");
  overlayEl.setAttribute("aria-hidden", "true");
  overlayEl.style.cssText =
    "position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0A0A0A;opacity:0;pointer-events:none;";

  const inner = document.createElement("div");
  inner.className = "flex flex-col items-center justify-center text-center select-none px-6";

  const line1 = document.createElement("div");
  line1.className = "text-2xl font-semibold tracking-[0.12em] md:text-3xl";
  line1.style.cssText = "color:#F5F5F5;";
  line1.textContent = "ZMY 朱美阳";

  const line2 = document.createElement("div");
  line2.className = "mt-3 text-sm tracking-[0.28em] font-light md:text-base";
  line2.style.cssText = "color:#E0E0E0;";
  line2.textContent = "AI 个人站";

  inner.appendChild(line1);
  inner.appendChild(line2);
  overlayEl.appendChild(inner);
  breathEl = inner;

  const barWrap = document.createElement("div");
  barWrap.className = "mt-10 flex w-full max-w-[200px] flex-col items-center gap-2 px-4";
  barWrap.style.cssText = "margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;max-width:200px;padding:0 16px;";

  const track = document.createElement("div");
  track.style.cssText = "height:2px;width:100%;overflow:hidden;border-radius:9999px;background:rgba(255,255,255,0.08);";

  barEl = document.createElement("div");
  barEl.style.cssText =
    "height:100%;width:0%;border-radius:9999px;background:linear-gradient(to right,#00D4FF,#8B7CFF);box-shadow:0 0 6px rgba(0,212,255,0.5);transition:width 200ms ease-out;";

  track.appendChild(barEl);
  barWrap.appendChild(track);

  pctEl = document.createElement("div");
  pctEl.style.cssText = "font-size:10px;letter-spacing:0.12em;color:rgba(139,149,164,0.5);";
  pctEl.textContent = "0%";
  barWrap.appendChild(pctEl);

  overlayEl.appendChild(barWrap);
  document.body.appendChild(overlayEl);
}

function showOverlay() {
  ensureOverlay();
  if (!overlayEl || !breathEl || !barEl || !pctEl) return;

  clearTimeout(exitTimer!);
  cancelAnimationFrame(rafId);
  showedAt = Date.now();

  barEl.style.width = "0%";
  pctEl.textContent = "0%";

  overlayEl.style.pointerEvents = "auto";
  overlayEl.style.animation = "transition-fade-in 0.2s ease forwards";
  breathEl.style.animation = "transition-breathe 2.4s ease-in-out infinite";

  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.touchAction = "none";

  const tick = () => {
    const elapsed = Date.now() - showedAt;
    const raw = Math.min(1, elapsed / DURATION);
    const eased = 1 - (1 - raw) ** 3;
    const pct = Math.round(eased * 100);
    if (barEl) barEl.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (raw < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };
  rafId = requestAnimationFrame(tick);
}

function hideOverlay() {
  if (!overlayEl || !breathEl) return;

  cancelAnimationFrame(rafId);
  if (barEl) barEl.style.width = "100%";
  if (pctEl) pctEl.textContent = "100%";

  breathEl.style.animation = "";

  exitTimer = setTimeout(() => {
    if (!overlayEl) return;
    overlayEl.style.animation = "transition-fade-out 0.3s ease forwards";
    exitTimer = setTimeout(() => {
      if (!overlayEl) return;
      overlayEl.style.pointerEvents = "none";
      overlayEl.style.animation = "";
      breathEl!.style.animation = "";
      if (barEl) barEl.style.width = "0%";
      if (pctEl) pctEl.textContent = "0%";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    }, EXIT_DURATION + 50);
  }, 100);
}

function scheduleHide() {
  const elapsed = Date.now() - showedAt;
  const remaining = Math.max(0, DURATION - elapsed);
  clearTimeout(exitTimer!);
  exitTimer = setTimeout(hideOverlay, remaining);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevPathRef.current = pathname;
      return;
    }

    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    const [newBase] = pathname.split("#");
    const [oldBase] = prev.split("#");

    if (newBase === oldBase) return;
    if (oldBase === "/") return;

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scheduleHide();
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (/^(https?:|mailto:|tel:)/.test(href)) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const [targetBase] = href.split("#");
      const [currentBase] = window.location.pathname.split("#");

      if (targetBase === currentBase) return;

      // Skip page transition when leaving the homepage (it has its own GlassBreakTransition)
      if (currentBase === "/") return;

      showOverlay();
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(exitTimer!);
      cancelAnimationFrame(rafId);
      if (overlayEl && overlayEl.parentNode) {
        overlayEl.parentNode.removeChild(overlayEl);
        overlayEl = null;
        breathEl = null;
        barEl = null;
        pctEl = null;
      }
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    };
  }, []);

  return <>{children}</>;
}

export function TransitionLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />;
}
