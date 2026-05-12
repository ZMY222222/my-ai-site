"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface IconItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface IconNavSelectorProps {
  items: IconItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const ICON_W = 56;
const GAP = 32;
const STEP = ICON_W + GAP;
const SELECTED_SCALE = 1.3;
const INDICATOR_COLOR = "#f97316";
const SWIPE_THRESHOLD = 30;

export function IconNavSelector({ items, activeId, onSelect }: IconNavSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIdx, setCenterIdx] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, started: false });
  const dragDxRef = useRef(0);
  const centerRef = useRef(0);
  const [containerW, setContainerW] = useState(400);

  // Keep ref in sync
  centerRef.current = centerIdx;
  dragDxRef.current = dragDx;

  const n = items.length;

  // Sync centerIdx from external activeId
  useEffect(() => {
    const i = items.findIndex((it) => it.id === activeId);
    if (i >= 0 && i !== centerIdx) setCenterIdx(i);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Track container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const next = ((centerIdx - 1) % n + n) % n;
        setCenterIdx(next);
        onSelect(items[next].id);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (centerIdx + 1) % n;
        setCenterIdx(next);
        onSelect(items[next].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [centerIdx, n, items, onSelect]);

  // Center position for the centered item in the virtual track
  const centerX = containerW / 2;
  const baseOffset = (centerIdx + 2) * STEP - centerX + ICON_W / 2;

  // Handle pointer events — no setPointerCapture, use document listeners for move/up
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      setDragDx(0);
      dragRef.current = { startX: e.clientX, started: true };
    },
    [],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.started) return;
      setDragDx(e.clientX - dragRef.current.startX);
    };
    const onUp = () => {
      setIsDragging(false);
      const dx = dragDxRef.current;
      setDragDx(0);
      dragRef.current.started = false;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        const dir = dx < 0 ? 1 : -1;
        const next = ((centerRef.current + dir) % n + n) % n;
        setCenterIdx(next);
        onSelect(items[next].id);
      }
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, [isDragging, n, items, onSelect]);

  // Current offset = base - drag
  const currentOffset = baseOffset - dragDx;

  return (
    <div
      className="w-full select-none outline-none"
      tabIndex={0}
    >
      {/* Outer glass container — pointer events live here */}
      <div
        className="relative rounded-2xl overflow-hidden mx-auto"
        style={{
          width: 5 * STEP,
          maxWidth: "100%",
          height: 110,
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Clip area */}
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
          {/* Center indicator */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: "50%", width: 1, background: "rgba(255,255,255,0.04)" }}
          />

          {/* Track */}
          <div
            className="flex items-center absolute"
            style={{
              height: "100%",
              gap: GAP,
              transform: `translateX(${-currentOffset}px)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            {/* Render n+4 items for seamless wrapping: 2 extra on each side */}
            {Array.from({ length: n + 4 }, (_, i) => {
              const realIdx = ((i - 2) % n + n) % n;
              const isActive = realIdx === centerIdx;

              return (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (realIdx === centerIdx) return;
                    setCenterIdx(realIdx);
                    onSelect(items[realIdx].id);
                  }}
                  className="relative border-0 bg-transparent cursor-pointer outline-none flex-shrink-0 flex flex-col items-center justify-center"
                  style={{
                    width: ICON_W,
                    height: 110,
                    transition: "all 0.3s ease-out",
                    transform: isActive ? `scale(${SELECTED_SCALE}) translateY(-4px)` : "scale(1)",
                    opacity: isActive ? 1 : 0.6,
                    filter: isActive ? "drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 12px rgba(59,130,246,0.15))" : "none",
                  }}
                  aria-label={items[realIdx].title}
                >
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: ICON_W,
                      height: ICON_W,
                      fontSize: 28,
                      background: isActive ? `${items[realIdx].color}18` : "transparent",
                      borderRadius: 14,
                    }}
                  >
                    {items[realIdx].icon}
                  </div>
                  <div
                    className="absolute rounded-full transition-all duration-300"
                    style={{
                      bottom: 12,
                      height: 3,
                      width: isActive ? 20 : 0,
                      background: INDICATOR_COLOR,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Gradient masks */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 56, background: "linear-gradient(90deg, rgba(6,9,15,0.95) 0%, transparent 100%)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 56, background: "linear-gradient(270deg, rgba(6,9,15,0.95) 0%, transparent 100%)" }}
        />
      </div>

      {/* Title */}
      <div className="text-center mt-3 h-6">
        <span
          className="text-xs font-medium transition-all duration-300"
          style={{
            color: items[centerIdx]?.color ?? "#fff",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "1px",
          }}
        >
          {items[centerIdx]?.title ?? ""}
        </span>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => {
              setCenterIdx(i);
              onSelect(item.id);
            }}
            className="rounded-full border-0 cursor-pointer transition-all duration-300"
            style={{
              width: i === centerIdx ? 14 : 5,
              height: 5,
              background: i === centerIdx ? INDICATOR_COLOR : "rgba(255,255,255,0.12)",
            }}
            aria-label={item.title}
          />
        ))}
      </div>
    </div>
  );
}
