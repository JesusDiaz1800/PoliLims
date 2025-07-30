import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-label="PoliLIMS Logo"
    >
      <title>PoliLIMS Logo</title>
      <path
        d="M37.5 15 L37.5 45 L15 60 L15 90 L37.5 105 L67.5 105 L90 90 L90 60 L67.5 45 L37.5 45 M37.5 15 L67.5 15 L90 30 L90 60"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M67.5 15 L67.5 45"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <circle cx="67.5" cy="75" r="15" fill="currentColor" />
    </svg>
  );
}
