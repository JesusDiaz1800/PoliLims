"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export function OptimizedLink({ 
  href, 
  children, 
  className, 
  onClick,
  prefetch = true 
}: OptimizedLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    
    // Navegación instantánea
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link 
      href={href} 
      className={cn("transition-all duration-150 hover:scale-105", className)}
      onClick={handleClick}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}

// Hook para navegación optimizada
export function useOptimizedNavigation() {
  const router = useRouter();

  const navigate = React.useCallback((href: string) => {
    // Navegación instantánea sin delays
    router.push(href);
  }, [router]);

  const prefetch = React.useCallback((href: string) => {
    // Prefetch inteligente
    router.prefetch(href);
  }, [router]);

  return { navigate, prefetch };
}
