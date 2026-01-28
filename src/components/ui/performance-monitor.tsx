"use client";

import * as React from "react";
import { Activity, Zap, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  errors: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export function PerformanceMonitor({ 
  showDetails = false, 
  onMetricsUpdate 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    errors: 0
  });

  const [isVisible, setIsVisible] = React.useState(false);

  // Monitorear tiempo de carga
  React.useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Monitorear FPS
  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Monitorear uso de memoria
  React.useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    const interval = setInterval(checkMemory, 5000);
    checkMemory();

    return () => clearInterval(interval);
  }, []);

  // Monitorear errores
  React.useEffect(() => {
    const handleError = () => {
      setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  // Notificar cambios de métricas
  React.useEffect(() => {
    onMetricsUpdate?.(metrics);
  }, [metrics, onMetricsUpdate]);

  const getPerformanceStatus = () => {
    if (metrics.fps < 30 || metrics.loadTime > 3000) return 'poor';
    if (metrics.fps < 50 || metrics.loadTime > 1500) return 'fair';
    return 'good';
  };

  const status = getPerformanceStatus();

  if (!showDetails && !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Monitoreo de Rendimiento
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={status === 'good' ? 'default' : status === 'fair' ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {status === 'good' ? 'Óptimo' : status === 'fair' ? 'Aceptable' : 'Lento'}
              </Badge>
              {!showDetails && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Tiempo de Carga</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metrics.loadTime.toFixed(0)}ms
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">FPS</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metrics.fps}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Memoria</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metrics.memoryUsage}MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Errores</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metrics.errors}
                </p>
              </div>
            </div>
          </div>
          
          {showDetails && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Rendimiento</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {status === 'good' ? 'Excelente' : status === 'fair' ? 'Bueno' : 'Necesita mejora'}
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      status === 'good' ? 'bg-green-500' : 
                      status === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${status === 'good' ? 100 : status === 'fair' ? 70 : 30}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para usar el monitor de rendimiento
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  const handleMetricsUpdate = React.useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);

  return {
    metrics,
    PerformanceMonitor: () => (
      <PerformanceMonitor 
        showDetails={true} 
        onMetricsUpdate={handleMetricsUpdate} 
      />
    )
  };
}
