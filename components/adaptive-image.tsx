"use client";

import { useState } from "react";

const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

type AdaptiveImageProps = {
  base: string;
  alt: string;
  className?: string;
};

export function AdaptiveImage({ base, alt, className }: AdaptiveImageProps) {
  const [extIdx, setExtIdx] = useState(0);

  return (
    <img
      src={`${base}${EXTENSIONS[extIdx]}`}
      alt={alt}
      className={className}
      onError={() => {
        if (extIdx < EXTENSIONS.length - 1) {
          setExtIdx(extIdx + 1);
        }
      }}
    />
  );
}
