"use client";

import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  id?: string;
}

/**
 * Wrapper component that provides a consistent loading experience
 * for lazy-loaded components
 */
export function LazyComponentWrapper({ 
  children, 
  fallback, 
  id = 'lazy-component' 
}: LazyComponentProps) {
  // Default fallback is a simple skeleton loader
  const defaultFallback = (
    <div className="animate-pulse bg-muted/20 rounded-md w-full h-full min-h-[100px]" />
  );
  
  // Track when component is loaded
  const handleOnLoad = () => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`Component ${id} loaded`);
    }
  };
  
  React.useEffect(() => {
    return () => {
      // Cleanup when component unmounts
    };
  }, []);
  
  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div onLoad={handleOnLoad}>
        {children}
      </div>
    </Suspense>
  );
}

/**
 * Creates a lazy-loaded component with performance monitoring
 * @param importFn - Dynamic import function for the component
 * @param fallback - Optional fallback UI while loading
 * @param options - Additional options
 * @returns Lazy-loaded component
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  options: {
    id?: string;
    preload?: boolean;
    ssr?: boolean;
  } = {}
) {
  const { id = 'lazy-component', preload = false, ssr = false } = options;
  
  // Create the lazy component
  const LazyComponent = lazy(importFn);
  
  // Preload the component if requested
  if (preload && typeof window !== 'undefined') {
    importFn().catch(err => 
      console.warn(`Failed to preload component ${id}:`, err)
    );
  }
  
  // Return a wrapped component
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <LazyComponentWrapper fallback={fallback} id={id}>
      <LazyComponent {...props} />
    </LazyComponentWrapper>
  );
  
  // Add display name for debugging
  WrappedComponent.displayName = `Lazy(${id})`;
  
  return WrappedComponent;
}

/**
 * Utility to create multiple lazy-loaded components at once
 * @param componentMap - Map of component names to import functions
 * @param defaultFallback - Default fallback UI for all components
 * @returns Object with lazy-loaded components
 */
export function createLazyComponentMap<T extends Record<string, () => Promise<{ default: ComponentType<any> }>>>(
  componentMap: T,
  defaultFallback?: React.ReactNode
): { [K in keyof T]: ReturnType<typeof createLazyComponent> } {
  const result = {} as { [K in keyof T]: ReturnType<typeof createLazyComponent> };
  
  for (const key in componentMap) {
    result[key] = createLazyComponent(
      componentMap[key],
      defaultFallback,
      { id: String(key) }
    );
  }
  
  return result;
}