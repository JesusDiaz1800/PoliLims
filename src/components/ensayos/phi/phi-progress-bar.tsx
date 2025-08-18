
"use client";

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PhiProgressBarProps {
  fechaInicio: string;
  horas: number;
  isComplete: boolean;
}

export function PhiProgressBar({ fechaInicio, horas, isComplete }: PhiProgressBarProps) {
  const [progress, setProgress] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    if (isComplete) {
      setProgress(100);
      return;
    }

    const calculateProgress = () => {
      const inicio = new Date(fechaInicio).getTime();
      const ahora = new Date().getTime();
      const totalMilisegundos = horas * 60 * 60 * 1000;
      const transcurrido = ahora - inicio;
      let porcentaje = (transcurrido / totalMilisegundos) * 100;
      if (porcentaje > 100) porcentaje = 100;
      if (porcentaje < 0) porcentaje = 0;
      setProgress(porcentaje);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 1000); 

    return () => clearInterval(interval);
  }, [fechaInicio, horas, isComplete, isClient]);
  
  const getIndicatorColorClass = () => {
    if (progress < 40) return "bg-red-500";
    if (progress < 80) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const textColor = progress >= 80 ? 'text-primary-foreground' : 'mix-blend-difference text-white';

  if (!isClient) {
    return <Progress value={0} />;
  }
  
  return (
    <div className="relative w-full h-full">
      <Progress value={progress} indicatorClassName={cn( "transition-all duration-500", getIndicatorColorClass() )} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xs font-semibold", textColor)}>{progress.toFixed(1)}%</span>
      </div>
    </div>
  );
}
