"use client";

import type { ReactNode } from "react";
import { TransitionLink } from "@/components/page-transition";

export function AnimatedCard({
  index,
  href,
  animate,
  children,
}: {
  index: number;
  href: string;
  animate: boolean;
  children: ReactNode;
}) {
  return (
    <TransitionLink
      href={href}
      className={`group block ${animate ? "animate-fade-in-up" : ""}`}
      style={animate ? { animationDelay: `${index * 80 + 100}ms` } : undefined}
    >
      {children}
    </TransitionLink>
  );
}
