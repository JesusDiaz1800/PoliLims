import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 184 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-label="Polifusion Logo"
    >
      <title>Polifusion Logo</title>
      <g fill="currentColor" fontFamily="sans-serif" fontWeight="bold">
        {/* Stylized P */}
        <path d="M28.82,24.58H19.5V15.32h8.54c2.7,0,4.42,1.83,4.42,4.63,0,2.8-1.72,4.63-3.64,4.63ZM15.91,10.21H29.14c5.08,0,8.08,3.22,8.08,8.08,0,4.3-2.61,7.24-6.6,7.24h-1.4v4.26H15.91V10.21ZM0,30V10.2H3.59v19.7H0Z" />
        
        {/* POLIFUSIÓN Text */}
        <text x="44" y="29" fontSize="24">
          POLIFUSI
          <tspan>
            Ó
          </tspan>
          N
        </text>
      </g>
    </svg>
  );
}
