"use client"

import { AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertaValidacionProps {
  mensaje?: string;
  tipo?: 'error' | 'advertencia';
  className?: string;
}

export function AlertaValidacion({ mensaje, tipo = 'error', className }: AlertaValidacionProps) {
  if (!mensaje) return null;

  const esError = tipo === 'error';

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs mt-1.5",
      esError ? 'text-destructive/90' : 'text-yellow-500/90',
      className
    )}>
      {esError ? <AlertCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
      <span>{mensaje}</span>
    </div>
  );
}
