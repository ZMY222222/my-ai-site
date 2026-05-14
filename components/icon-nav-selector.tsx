"use client";

import { useState } from "react";

const AC = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const FLOAT_DELAYS = ["0s", "0.4s", "0.8s", "1.2s"];

interface IconItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  cover?: string;
}

interface IconNavSelectorProps {
  items: IconItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function IconNavSelector({ items, activeId, onSelect }: IconNavSelectorProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10">
      {items.map((item, i) => {
        const isActive = item.id === activeId;
        const isHover = item.id === hoverId;
        const borderColor = AC[i % 5];
        const shadowColor = AC[(i + 2) % 5];

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            onMouseEnter={() => setHoverId(item.id)}
            onMouseLeave={() => setHoverId(null)}
            className="relative bg-transparent border-0 cursor-pointer outline-none p-0"
            style={{
              animation: `float 3s ease-in-out infinite`,
              animationDelay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
              filter: isActive
                ? `drop-shadow(0 0 24px ${borderColor}60)`
                : "none",
              transition: "filter 0.35s ease",
            }}
            aria-label={item.title}
          >
            <div
              className="overflow-hidden"
              style={{
                width: 140,
                height: 140,
                borderRadius: 24,
                border: `4px ${i % 2 === 0 ? "solid" : "dashed"} ${isActive ? borderColor : `${borderColor}70`}`,
                boxShadow: isActive
                  ? `8px 8px 0 ${shadowColor}, 0 0 28px ${borderColor}40`
                  : isHover
                    ? `6px 6px 0 ${shadowColor}90`
                    : `4px 4px 0 ${shadowColor}40`,
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
                transform: isActive
                  ? "scale(1.15)"
                  : isHover
                    ? "scale(1.06)"
                    : "scale(1)",
                background: "#2D1B4E",
              }}
            >
              {item.cover ? (
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl"
                  style={{ background: `${item.color}20` }}
                >
                  {item.icon}
                </div>
              )}
            </div>

            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                bottom: -8,
                height: 4,
                width: isActive ? 32 : 0,
                background: `linear-gradient(90deg, ${borderColor}, ${shadowColor})`,
                opacity: isActive ? 1 : 0,
                boxShadow: `0 0 10px ${borderColor}`,
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
