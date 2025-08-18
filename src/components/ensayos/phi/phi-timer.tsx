
"use client";
import * as React from 'react';

interface PhiTimerProps {
  fechaInicio: string;
  horas: number;
  isComplete: boolean;
}

export function PhiTimer({ fechaInicio, horas, isComplete }: PhiTimerProps) {
  const [tiempoRestante, setTiempoRestante] = React.useState("00:00:00");
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    if (isComplete) {
      setTiempoRestante("00:00:00");
      return;
    }

    const calculateRemainingTime = () => {
      const inicio = new Date(fechaInicio).getTime();
      const ahora = new Date().getTime();
      const totalSegundos = horas * 60 * 60;
      const transcurridoSegundos = Math.floor((ahora - inicio) / 1000);
      let restante = totalSegundos - transcurridoSegundos;
      
      if (restante < 0) restante = 0;
      
      const h = Math.floor(restante / 3600);
      const m = Math.floor((restante % 3600) / 60);
      const s = restante % 60;

      setTiempoRestante(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };

    const interval = setInterval(calculateRemainingTime, 1000);
    calculateRemainingTime();

    return () => clearInterval(interval);
  }, [fechaInicio, horas, isComplete, isClient]);

  if (!isClient) {
    return (
      <div className="font-mono bg-black text-cyan-400 text-center rounded p-2 text-3xl tabular-nums shadow-lg border-2 border-gray-700" style={{ textShadow: '0 0 5px hsl(188 100% 50% / 0.7)' }}>
        --:--:--
      </div>
    );
  }

  return (
    <div className="font-mono bg-black text-cyan-400 text-center rounded p-2 text-3xl tabular-nums shadow-lg border-2 border-gray-700" style={{ textShadow: '0 0 5px hsl(188 100% 50% / 0.7)' }}>
      {tiempoRestante}
    </div>
  );
}
