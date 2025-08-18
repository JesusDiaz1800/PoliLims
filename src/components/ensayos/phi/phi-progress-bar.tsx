
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

    if(isComplete) {
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
    const interval = setInterval(calculateProgress, 1000 * 60); // Update every minute is enough

    return () => clearInterval(interval);
  }, [fechaInicio, horas, isComplete, isClient]);
  
  const getIndicatorColor = () => {
    if (progress < 50) {
      const red = 255;
      const green = Math.round(progress * 2 * 2.55);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const red = Math.round((100 - progress) * 2 * 2.55);
      const green = 255;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  return <Progress value={progress} indicatorClassName="transition-none" style={{'--tw-bg-primary': getIndicatorColor()} as React.CSSProperties} />;
}
