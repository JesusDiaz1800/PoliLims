
"use client";

import { useState, useEffect } from 'react';

const loadingMessages = [
    "Cargando componentes...",
    "Analizando datos...",
    "Preparando el laboratorio...",
    "Calibrando instrumentos...",
    "Optimizando visualizaciones...",
    "Poniendo todo a punto...",
];

const LoadingSpinner = () => (
    <div className="w-16 h-16 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary) / 0.1)" strokeWidth="4" fill="none" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-orbit" style={{ animationDelay: '0s' }}></div>
        </div>
         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-orbit" style={{ animationDelay: '0.5s', transform: 'rotate(120deg)' }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-orbit" style={{ animationDelay: '1s', transform: 'rotate(240deg)' }}></div>
        </div>
    </div>
);


export default function Loading() {
  const [message, setMessage] = useState(loadingMessages[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a random message on initial mount, only on the client side
    setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-1 items-center justify-center h-[calc(100vh-8rem)] transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <LoadingSpinner />
        <div>
            <p className="text-xl font-semibold font-headline text-foreground">{message}</p>
            <p className="text-muted-foreground">Por favor, espere un momento.</p>
        </div>
      </div>
    </div>
  );
}
