"use client";

import * as React from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOptimizerProps {
  isLoading: boolean;
  error?: string | null;
  success?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minLoadTime?: number; // Tiempo mínimo de carga para evitar parpadeo
  className?: string;
}

export function LoadingOptimizer({
  isLoading,
  error,
  success = false,
  children,
  fallback,
  minLoadTime = 300,
  className
}: LoadingOptimizerProps) {
  const [showContent, setShowContent] = React.useState(false);
  const [startTime] = React.useState(Date.now());

  React.useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      
      const timer = setTimeout(() => {
        setShowContent(true);
      }, remaining);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, startTime, minLoadTime]);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Completado</span>
        </div>
      </div>
    );
  }

  if (isLoading || !showContent) {
    return (
      fallback || (
        <div className={cn("flex items-center justify-center p-8", className)}>
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Cargando...</span>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Componente de skeleton optimizado
interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export function Skeleton({ 
  className, 
  count = 1, 
  height = "h-4", 
  width = "w-full" 
}: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse bg-slate-200 dark:bg-slate-700 rounded",
            height,
            width,
            className
          )}
        />
      ))}
    </div>
  );
}

// Componente de progreso optimizado
interface ProgressOptimizerProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressOptimizer({
  progress,
  label,
  showPercentage = true,
  className
}: ProgressOptimizerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{label}</span>
          {showPercentage && (
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Hook para manejar estados de carga
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setSuccess(false);
  }, []);

  const setSuccessState = React.useCallback(() => {
    setSuccess(true);
    setIsLoading(false);
    setError(null);
  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    startLoading,
    stopLoading,
    setErrorState,
    setSuccessState,
    reset
  };
}

// Componente de carga con progreso
interface LoadingWithProgressProps {
  progress: number;
  message?: string;
  className?: string;
}

export function LoadingWithProgress({
  progress,
  message = "Procesando...",
  className
}: LoadingWithProgressProps) {
  return (
    <div className={cn("space-y-4 p-6", className)}>
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {message}
        </span>
      </div>
      <ProgressOptimizer progress={progress} />
    </div>
  );
}
