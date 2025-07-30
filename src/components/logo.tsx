import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-label="Polifusión Logo"
    >
      <title>Polifusión Logo</title>
      <g fill="currentColor">
        {/* Stylized P */}
        <path d="M45.6,10.8c-15.9,0-28.8,12.9-28.8,28.8s12.9,28.8,28.8,28.8s28.8-12.9,28.8-28.8S61.5,10.8,45.6,10.8z M45.6,60.4 c-11.5,0-20.8-9.3-20.8-20.8S34.1,18.8,45.6,18.8s20.8,9.3,20.8,20.8S57.1,60.4,45.6,60.4z" />
        <path d="M46.8,28.8h-9.6v21.6h9.6c6,0,10.8-4.8,10.8-10.8S52.8,28.8,46.8,28.8z" />
        <path d="M24,42V21.6c0-5.3,4.3-9.6,9.6-9.6h12c11.2,0,20.4,9.1,20.4,20.4c0,11.2-9.1,20.4-20.4,20.4H33.6V60h-9.6V42z M33.6,50.4h12c5.9,0,10.8-4.8,10.8-10.8S51.5,28.8,45.6,28.8h-12V50.4z" />
        <path d="M33.6,62.4V84h38.4V62.4H33.6z M62.4,74.4h-2.4V69.6h2.4V74.4z" />
      </g>
      {/* POLIFUSION Text */}
      <text x="10" y="105" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="currentColor">
        POLIFUSIÓN
      </text>
    </svg>
  );
}
