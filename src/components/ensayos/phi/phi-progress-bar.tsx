
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
    const interval = setInterval(calculateProgress, 1000 * 60);

    return () => clearInterval(interval);
  }, [fechaInicio, horas, isComplete, isClient]);
  
  const getIndicatorColor = () => {
    if (progress >= 100) return 'hsl(var(--chart-2))'; // Green for complete
    
    // RGB for red (239, 68, 68) and yellow (245, 158, 11)
    const red = [239, 68, 68];
    const yellow = [245, 158, 11];

    // Interpolate between red and yellow
    const r = Math.round(red[0] + (yellow[0] - red[0]) * (progress / 100));
    const g = Math.round(red[1] + (yellow[1] - red[1]) * (progress / 100));
    const b = Math.round(red[2] + (yellow[2] - red[2]) * (progress / 100));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  if (!isClient) {
    return <Progress value={0} />;
  }
  
  const textColor = progress >= 100 ? 'text-white' : 'mix-blend-difference text-white';

  return (
    <div className="relative w-full h-full">
      <Progress value={progress} indicatorStyle={{ backgroundColor: getIndicatorColor() }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xs font-semibold", textColor)}>{progress.toFixed(1)}%</span>
      </div>
    </div>
  );
}
