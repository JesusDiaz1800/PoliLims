"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavigationLoadingProps {
  isNavigating: boolean;
  className?: string;
}

export const NavigationLoading = React.memo(({ isNavigating, className }: NavigationLoadingProps) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isNavigating) {
      // Mostrar más rápido para mejor percepción
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isNavigating]);

  if (!visible) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-accent to-primary",
      "opacity-90 shadow-lg",
      className
    )}>
      <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );
});

NavigationLoading.displayName = "NavigationLoading";

// Componente de loading para páginas
export const PageLoading = React.memo(() => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDelay: '-0.5s' }} />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    </div>
  );
});

PageLoading.displayName = "PageLoading";

// Componente de skeleton optimizado
export const OptimizedSkeleton = React.memo(({ className }: { className?: string }) => {
  return (
    <div className={cn(
      "animate-pulse bg-muted rounded-md",
      "bg-gradient-to-r from-muted via-muted/50 to-muted",
      className
    )} />
  );
});

OptimizedSkeleton.displayName = "OptimizedSkeleton";
