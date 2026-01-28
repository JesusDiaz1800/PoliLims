"use client";

import * as React from "react";
import { useDynamicData } from "@/context/data-context";

interface ContextWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ContextWrapper = React.memo(({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}: ContextWrapperProps) => {
  const [isContextReady, setIsContextReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      // Intentar acceder al contexto para verificar que esté disponible
      const context = useDynamicData();
      if (context) {
        setIsContextReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Context not available');
    }
  }, []);

  if (error) {
    console.warn('Context not ready:', error);
    return <>{fallback}</>;
  }

  if (!isContextReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});

ContextWrapper.displayName = "ContextWrapper";
