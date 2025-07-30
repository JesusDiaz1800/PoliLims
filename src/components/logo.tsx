import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      <title>PoliLIMS Logo</title>
      <g fill="currentColor">
        <path d="M20,20 L20,80 L50,80 L50,50 Z" />
        <path d="M50,20 L80,20 L80,50 L50,50 Z" opacity="0.75" />
        <path d="M50,50 L80,50 L80,80 L50,80 Z" />
      </g>
    </svg>
  );
}
