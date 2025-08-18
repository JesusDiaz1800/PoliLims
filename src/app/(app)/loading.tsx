
"use client";

import { useState, useEffect } from 'react';
import { LogoAlt } from '@/components/logo-alt';

const loadingMessages = [
    "Cargando componentes...",
    "Analizando datos del laboratorio...",
    "Calibrando instrumentos virtuales...",
    "Optimizando visualizaciones...",
    "Poniendo todo a punto...",
];

const LoadingSpinner = () => (
    <div className="w-24 h-24 relative">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div 
            className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16">
                 <LogoAlt className="text-primary"/>
            </div>
        </div>
    </div>
);


export default function Loading() {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    // This effect runs only on the client, preventing server/client mismatch.
    setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center h-[calc(100vh-8rem)]">
      <div className="flex flex-col items-center gap-6 text-center animate-in fade-in-50">
        <LoadingSpinner />
        <div>
            <p className="text-xl font-semibold font-headline text-foreground">{message}</p>
            <p className="text-muted-foreground">Por favor, espere un momento.</p>
        </div>
      </div>
    </div>
  );
}
