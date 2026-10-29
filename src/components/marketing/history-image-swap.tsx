"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HistoryImageSwapProps {
  alt: string;
}

export function HistoryImageSwap({ alt }: HistoryImageSwapProps) {
  const [tapped, setTapped] = useState(false);

  return (
    <div
      className="relative h-80 rounded-md overflow-hidden shadow-elevated cursor-pointer group select-none"
      onClick={() => setTapped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setTapped((v) => !v);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={tapped}
      aria-label="Toggle between historic photograph views"
    >
      <Image
        src="/images/about-history.png"
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-700 ease-in-out",
          tapped ? "opacity-0" : "opacity-100 group-hover:opacity-0"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <Image
        src="/images/about-history2.png"
        alt={`${alt} — alternate view`}
        fill
        className={cn(
          "object-cover transition-opacity duration-700 ease-in-out",
          tapped ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
