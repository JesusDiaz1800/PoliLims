"use client";

import * as React from "react";

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  threshold?: number;
  fallback?: React.ReactNode;
}

export function PerformanceOptimizer({ 
  children, 
  threshold = 100, 
  fallback = <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg h-32" />
}: PerformanceOptimizerProps) {
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Renderizar después de un pequeño delay para evitar bloqueos
          const timer = setTimeout(() => {
            setShouldRender(true);
          }, threshold);
          return () => clearTimeout(timer);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {shouldRender ? children : fallback}
    </div>
  );
}

// Hook para optimizar el rendimiento de listas grandes
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    offsetY,
    handleScroll,
    containerRef,
    totalHeight: items.length * itemHeight
  };
}

// Hook para debounce de búsquedas
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para memoización de cálculos costosos
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return React.useMemo(calculation, dependencies);
}

// Componente para lazy loading de imágenes
export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);

  return (
    <img
      src={isLoaded ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}

// Componente para optimizar re-renders
export function OptimizedComponent<T extends object>({
  component: Component,
  props,
  dependencies
}: {
  component: React.ComponentType<T>;
  props: T;
  dependencies: React.DependencyList;
}) {
  return React.useMemo(() => <Component {...props} />, dependencies);
}
