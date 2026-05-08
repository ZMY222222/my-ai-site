"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/components/audio-analyser";

export function AvatarRipple({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    return subscribe((e) => setEnergy(e));
  }, []);

  // rings scale from 1.0 to 1.0+energy, opacity fades
  const rings = [
    { delay: 0,    scale: 1 + energy * 0.35, opacity: 0.6 * energy + 0.05 },
    { delay: 150,  scale: 1 + energy * 0.50, opacity: 0.4 * energy + 0.03 },
    { delay: 300,  scale: 1 + energy * 0.65, opacity: 0.25 * energy + 0.02 },
  ];

  return (
    <div className="relative inline-flex items-center justify-center">
      {rings.map((ring, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border transition-all"
          style={{
            borderColor: `rgba(110,168,254,${ring.opacity.toFixed(3)})`,
            transform: `scale(${ring.scale})`,
            transitionDuration: `${200 + i * 80}ms`,
            transitionTimingFunction: "ease-out",
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
