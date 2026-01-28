"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface LightHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const LightHeader = React.memo(({ children, className }: LightHeaderProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const headerClasses = cn(
    "sticky top-0 z-30 flex items-center border-b backdrop-blur-sm px-4 sm:px-6",
    mounted && theme === "light" 
      ? "light-header-enhanced" 
      : "bg-background/80",
    className
  );

  return (
    <header className={headerClasses} role="banner">
      {children}
    </header>
  );
});

LightHeader.displayName = "LightHeader";
