
"use client";

import * as React from 'react';
import { Progress } from '@/components/ui/progress';

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
    const percentage = progress / 100;
    let r, g;
    if (percentage < 0.5) {
      r = 255;
      g = Math.round(percentage * 2 * 255);
    } else {
      r = Math.round((1 - percentage) * 2 * 255);
      g = 255;
    }
    return `rgb(${r}, ${g}, 0)`;
  };

  if (!isClient) {
    return <Progress value={0} />;
  }

  return (
    <div className="relative w-full h-full">
      <Progress value={progress} indicatorStyle={{ backgroundColor: getIndicatorColor() }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white mix-blend-difference">{progress.toFixed(1)}%</span>
      </div>
    </div>
  );
}
