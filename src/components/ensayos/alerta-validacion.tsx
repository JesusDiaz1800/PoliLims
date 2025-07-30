"use client"

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertaValidacionProps {
  mensaje?: string;
  className?: string;
}

export function AlertaValidacion({ mensaje, className }: AlertaValidacionProps) {
  if (!mensaje) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-destructive/90 mt-1.5", className)}>
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{mensaje}</span>
    </div>
  );
}
