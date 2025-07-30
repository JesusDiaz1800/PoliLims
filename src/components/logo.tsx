import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
       <Image
        src="/logo.png"
        alt="Polifusion Logo"
        fill
        sizes="12rem"
        className="object-contain"
        priority
      />
    </div>
  );
}