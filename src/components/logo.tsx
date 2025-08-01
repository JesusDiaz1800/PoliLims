
"use client";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        data-ai-hint="Polifusión S.A. logo"
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
            .logo-text {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 52px;
              fill: hsl(var(--primary));
            }
            .logo-circle {
              fill: hsl(var(--accent));
            }
            .dark .logo-text {
              fill: hsl(var(--primary-foreground));
            }
          `}
        </style>
        <g>
          <circle className="logo-circle" cx="45" cy="50" r="35" />
          <text x="25" y="68" fontSize="50" fill="hsl(var(--primary-foreground))" fontFamily="Space Grotesk, sans-serif" fontWeight="700">P</text>
          <text className="logo-text" x="100" y="65">Polifusión</text>
        </g>
      </svg>
    </div>
  );
}
