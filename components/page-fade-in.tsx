"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageFadeIn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(k => k + 1);
  }, [pathname]);

  return (
    <div key={key} style={{ animation: "page-fade-in 0.4s ease-out both", flex: 1 }}>
      {children}
    </div>
  );
}
