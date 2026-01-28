"use client";

import { useEffect, useRef, useCallback } from "react";

interface AIPerformanceOptimizerProps {
  onOptimize?: () => void;
}

export function AIPerformanceOptimizer({ onOptimize }: AIPerformanceOptimizerProps) {
  const lastOptimization = useRef<number>(0);
  const optimizationInterval = useRef<NodeJS.Timeout | null>(null);

  // Optimización automática cada 5 minutos
  const startAutoOptimization = useCallback(() => {
    if (optimizationInterval.current) {
      clearInterval(optimizationInterval.current);
    }

    optimizationInterval.current = setInterval(() => {
      const now = Date.now();
      if (now - lastOptimization.current > 5 * 60 * 1000) { // 5 minutos
        performOptimization();
      }
    }, 60000); // Verificar cada minuto
  }, []);

  const performOptimization = useCallback(() => {
    // Limpiar caché del navegador para el chat
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('ai-chat')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Optimizar memoria
    if (window.gc) {
      window.gc();
    }

    // Limpiar variables no utilizadas
    lastOptimization.current = Date.now();
    
    if (onOptimize) {
      onOptimize();
    }

    console.log('Optimización de IA completada');
  }, [onOptimize]);

  // Optimización al montar el componente
  useEffect(() => {
    performOptimization();
    startAutoOptimization();

    return () => {
      if (optimizationInterval.current) {
        clearInterval(optimizationInterval.current);
      }
    };
  }, [performOptimization, startAutoOptimization]);

  // Optimización cuando la ventana pierde el foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        performOptimization();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [performOptimization]);

  return null; // Componente invisible
}

// Hook para optimizar el rendimiento del chat
export function useAIOptimization() {
  const messageQueue = useRef<Array<() => void>>([]);
  const isProcessing = useRef(false);

  const processQueue = useCallback(async () => {
    if (isProcessing.current || messageQueue.current.length === 0) {
      return;
    }

    isProcessing.current = true;

    while (messageQueue.current.length > 0) {
      const task = messageQueue.current.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Error en tarea de IA:', error);
        }
      }

      // Pequeña pausa para no bloquear el hilo principal
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    isProcessing.current = false;
  }, []);

  const addToQueue = useCallback((task: () => void) => {
    messageQueue.current.push(task);
    processQueue();
  }, [processQueue]);

  const clearQueue = useCallback(() => {
    messageQueue.current = [];
    isProcessing.current = false;
  }, []);

  return {
    addToQueue,
    clearQueue,
    queueLength: messageQueue.current.length,
    isProcessing: isProcessing.current
  };
}
