"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  return {
    measureMethod: (methodName: string, callback: () => void) => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now();
        callback();
        const end = performance.now();
        console.log(`⏱️ ${componentName}.${methodName}: ${(end - start).toFixed(2)}ms`);
      } else {
        callback();
      }
    }
  };
};

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
}

/**
 * OptimizedImage component that extends Next.js Image with:
 * - Performance monitoring
 * - Loading state
 * - Error handling with fallback
 * - Lazy loading
 * - Automatic WebP/AVIF format selection
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = '/placeholder-image.png',
  className,
  containerClassName,
  loadingClassName,
  errorClassName,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const performance = usePerformanceMonitor('OptimizedImage');
  const [isLoading, setIsLoading] = React.useState(!priority);
  const [hasError, setHasError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  // Reset states when src changes
  React.useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoading(!priority);
  }, [src, priority]);

  // Handle image load
  const handleLoad = React.useCallback(() => {
    performance.measureMethod('handleLoad', () => {
      setIsLoading(false);
    });
  }, [performance]);

  // Handle image error
  const handleError = React.useCallback(() => {
    performance.measureMethod('handleError', () => {
      setHasError(true);
      setIsLoading(false);
      if (fallbackSrc && src !== fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    });
  }, [fallbackSrc, performance, src]);

  return (
    <div className={cn('relative', containerClassName)}>
      {isLoading && (
        <div 
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse rounded-md',
            loadingClassName
          )}
          style={{ width, height }}
        />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && errorClassName,
          className
        )}
        priority={priority}
        onLoadingComplete={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    </div>
  );
}

/**
 * Responsive image component that automatically adjusts size based on container
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className,
  containerClassName,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { aspectRatio?: string }) {
  return (
    <div 
      className={cn('relative w-full', containerClassName)}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}