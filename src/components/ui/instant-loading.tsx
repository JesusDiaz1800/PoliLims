"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InstantLoadingProps {
  isVisible: boolean;
  className?: string;
}

export const InstantLoading = React.memo(({ isVisible, className }: InstantLoadingProps) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      "animate-in fade-in duration-150",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <div className="text-sm text-muted-foreground animate-pulse">
          Cargando...
        </div>
      </div>
    </div>
  );
});

InstantLoading.displayName = "InstantLoading";
