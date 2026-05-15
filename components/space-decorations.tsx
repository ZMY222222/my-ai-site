"use client";

import { useEffect, useState, useCallback } from "react";

const SPACE_ITEMS = [
  { emoji: "🚀", scale: 3.2, label: "火箭", kind: "rocket" },
  { emoji: "🛸", scale: 3.0, label: "UFO", kind: "ufo" },
  { emoji: "🌍", scale: 2.8, label: "地球", kind: "planet" },
  { emoji: "🌙", scale: 2.6, label: "月亮", kind: "planet" },
  { emoji: "🛰️", scale: 2.5, label: "卫星", kind: "satellite" },
  { emoji: "✨", scale: 2.6, label: "星光", kind: "star" },
  { emoji: "☄️", scale: 2.5, label: "彗星", kind: "meteor" },
  { emoji: "🪐", scale: 2.9, label: "土星", kind: "planet" },
  { emoji: "👨‍🚀", scale: 2.8, label: "宇航员", kind: "astronaut" },
  { emoji: "☀️", scale: 2.6, label: "太阳", kind: "star" },
  { emoji: "🌕", scale: 2.4, label: "满月", kind: "planet" },
  { emoji: "🌠", scale: 2.2, label: "流星雨", kind: "meteor" },
];

const COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

interface SpaceItemData {
  id: number;
  emoji: string;
  leftPct: number;
  topPct: number;
  scale: number;
  duration: number;
  delay: number;
  rotation: number;
  color: string;
  side: "left" | "right";
  label: string;
  kind: string;
  spinning: boolean;
  glowing: boolean;
  effectActive: boolean;
  dir: "fall" | "rise";
}

const ITEM_COUNT = 10;

function pseudoRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateItems(): SpaceItemData[] {
  const items: SpaceItemData[] = [];
  const gap = 100 / (ITEM_COUNT + 1);

  for (let i = 0; i < ITEM_COUNT; i++) {
    const side = (i % 2 === 0 ? "left" : "right") as "left" | "right";
    const spaceItem = SPACE_ITEMS[i % SPACE_ITEMS.length];
    const topPct = parseFloat((gap * (i + 1)).toFixed(2));
    const leftPct = side === "left" ? 6 : 88;
    const r = (n: number) => pseudoRand(i * 7 + n);

    items.push({
      id: i,
      emoji: spaceItem.emoji,
      leftPct,
      topPct,
      scale: parseFloat((spaceItem.scale * (1 + r(1) * 0.15 - 0.075)).toFixed(3)),
      duration: parseFloat((4 + r(2) * 5).toFixed(2)),
      delay: parseFloat((r(3) * 3).toFixed(2)),
      rotation: parseFloat(((r(4) - 0.5) * 10).toFixed(2)),
      color: COLORS[i % COLORS.length],
      side,
      label: spaceItem.label,
      kind: spaceItem.kind,
      spinning: false,
      glowing: false,
      effectActive: false,
      dir: r(5) > 0.5 ? "fall" : "rise",
    });
  }
  return items;
}

const INITIAL_ITEMS = generateItems();

export function SpaceDecorations() {
  const [items, setItems] = useState<SpaceItemData[]>(INITIAL_ITEMS);
  const [docHeight, setDocHeight] = useState(3000);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setDocHeight(document.body.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const triggerEffect = useCallback((itemId: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, effectActive: true } : it
      )
    );
    setTimeout(() => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, effectActive: false } : it
        )
      );
    }, 2600);
  }, []);

  const handleClick = useCallback((item: SpaceItemData) => {
    if (item.kind === "planet") {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, spinning: !it.spinning } : it
        )
      );
    } else if (item.kind === "star" || item.kind === "rocket" || item.kind === "meteor") {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, glowing: !it.glowing } : it
        )
      );
    } else {
      triggerEffect(item.id);
    }
  }, [triggerEffect]);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 w-full"
      style={{ height: mounted ? `${docHeight}px` : "3000px", zIndex: 0 }}
    >
      {items.map((item) => {
        const isSpinning = item.spinning;
        const isGlowing = item.glowing;
        const isHovered = item.id === hoveredId;

        return (
          <span
            key={item.id}
            className="pointer-events-auto absolute select-none cursor-pointer"
            style={{
              left: `${item.leftPct}%`,
              top: `${item.topPct}%`,
              fontSize: `${(item.scale * 2.3).toFixed(3)}rem`,
              transform: isHovered
                ? `rotate(${item.rotation.toFixed(2)}deg) scale(1.25)`
                : `rotate(${item.rotation.toFixed(2)}deg)`,
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease",
              animation: isSpinning
                ? `spinPlanet 1.8s linear infinite`
                : item.dir === "fall"
                ? `spaceFall ${item.duration.toFixed(2)}s ease-in-out infinite`
                : `spaceRise ${item.duration.toFixed(2)}s ease-in-out infinite`,
              animationDelay: `${item.delay.toFixed(2)}s`,
              filter: isSpinning
                ? `drop-shadow(0 0 24px ${item.color}) drop-shadow(0 0 48px ${item.color}50)`
                : isGlowing
                ? `drop-shadow(0 0 24px ${item.color}) drop-shadow(0 0 48px ${item.color}) drop-shadow(0 0 72px ${item.color})`
                : `drop-shadow(0 0 5px ${item.color}20)`,
              zIndex: isSpinning || isGlowing || isHovered ? 10 : 0,
            }}
            onClick={() => handleClick(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            title={`${item.label}`}
          >
            {item.kind === "ufo" && item.effectActive && (
              <>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: 0,
                      height: 0,
                      marginLeft: 0,
                      marginTop: 0,
                      opacity: 0,
                      border: `2px solid ${item.color}`,
                      boxShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}60`,
                      animation: `ufoWave 1.2s ease-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </>
            )}

            {item.kind === "satellite" && item.effectActive && (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: 0,
                      height: 0,
                      opacity: 0,
                      border: `3px solid ${item.color}`,
                      borderLeftColor: "transparent",
                      borderRightColor: "transparent",
                      borderBottomColor: "transparent",
                      animation: `signalPulse 1.5s ease-out infinite`,
                      animationDelay: `${i * 0.35}s`,
                    }}
                  />
                ))}
              </>
            )}

            {item.kind === "astronaut" && item.effectActive && (
              <span
                className="absolute pointer-events-none whitespace-nowrap"
                style={{
                  left: "50%",
                  bottom: "110%",
                  transform: "translateX(-50%)",
                  padding: "6px 14px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: 0,
                  animation: "dialogPop 2s ease-out forwards",
                }}
              >
                很高兴见到你 👋
              </span>
            )}

            {item.emoji}
          </span>
        );
      })}
    </div>
  );
}
