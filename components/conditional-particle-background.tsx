"use client";

import { usePathname } from "next/navigation";
import { ParticleNetworkBackground } from "@/components/particle-network-background";

export function ConditionalParticleBackground() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <ParticleNetworkBackground />;
}
