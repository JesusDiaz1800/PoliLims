"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Cpu,
  HardDrive,
  Network
} from "lucide-react";

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface PerformanceAnalyticsProps {
  className?: string;
}

export function PerformanceAnalytics({ className }: PerformanceAnalyticsProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0,
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    uptime: 0
  });

  // Simular métricas en tiempo real
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100,
        disk: Math.random() * 100,
        responseTime: Math.random() * 1000,
        throughput: Math.random() * 1000,
        errorRate: Math.random() * 5,
        uptime: 99.9 + Math.random() * 0.1
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "destructive";
    if (value >= thresholds.warning) return "secondary";
    return "default";
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="w-4 h-4" />;
    if (value >= thresholds.warning) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className={className}>
      <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Análisis de Rendimiento
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Tiempo Real
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Métricas del Sistema */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    CPU
                  </span>
                </div>
                <Badge 
                  variant={getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}
                  className="text-xs"
                >
                  {metrics.cpu.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics.cpu} 
                className="h-2"
                style={{
                  background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)'
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Memoria
                  </span>
                </div>
                <Badge 
                  variant={getStatusColor(metrics.memory, { warning: 80, critical: 95 })}
                  className="text-xs"
                >
                  {metrics.memory.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics.memory} 
                className="h-2"
                style={{
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Red
                  </span>
                </div>
                <Badge 
                  variant={getStatusColor(metrics.network, { warning: 75, critical: 90 })}
                  className="text-xs"
                >
                  {metrics.network.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics.network} 
                className="h-2"
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)'
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Disco
                  </span>
                </div>
                <Badge 
                  variant={getStatusColor(metrics.disk, { warning: 85, critical: 95 })}
                  className="text-xs"
                >
                  {metrics.disk.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics.disk} 
                className="h-2"
                style={{
                  background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'
                }}
              />
            </div>
          </div>

          {/* Métricas de Aplicación */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  Tiempo de Respuesta
                </span>
              </div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {metrics.responseTime.toFixed(0)}ms
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Promedio
              </div>
            </div>

            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-800 dark:text-green-200">
                  Throughput
                </span>
              </div>
              <div className="text-lg font-bold text-green-900 dark:text-green-100">
                {metrics.throughput.toFixed(0)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                req/s
              </div>
            </div>

            <div className="text-center p-3 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-800 dark:text-red-200">
                  Tasa de Error
                </span>
              </div>
              <div className="text-lg font-bold text-red-900 dark:text-red-100">
                {metrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                Última hora
              </div>
            </div>

            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                  Uptime
                </span>
              </div>
              <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {metrics.uptime.toFixed(3)}%
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                30 días
              </div>
            </div>
          </div>

          {/* Estado General */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Estado del Sistema
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Óptimo
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Todas las métricas están dentro de los rangos normales de operación
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
