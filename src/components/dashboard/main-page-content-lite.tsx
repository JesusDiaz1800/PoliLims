"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDynamicData } from "@/context/data-context";
import { FuturisticBackground } from "@/components/dashboard/futuristic-background";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

export default function MainPageContentLite() {
  const { ensayos, equipos, noConformidades } = useDynamicData();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Cálculos básicos sin useMemo para desarrollo rápido
  const totalEnsayos = ensayos?.length || 0;
  const ensayosAprobados = ensayos?.filter(e => e.estado === 'Aprobado').length || 0;
  const ensayosPendientes = ensayos?.filter(e => pendingStatuses.includes(e.estado)).length || 0;
  const equiposActivos = equipos?.filter(e => e.estado === "Activo").length || 0;
  const totalEquipos = equipos?.length || 0;
  const noConformidadesAbiertas = noConformidades?.filter(nc => nc.estado === "Abierta").length || 0;

  if (!mounted) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-10 relative min-h-screen">
        <FuturisticBackground />
        <div className="relative z-10">
          <div className="h-32 bg-muted animate-pulse rounded-lg mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 md:p-10 relative min-h-screen">
      <FuturisticBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Resumen general del laboratorio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Ensayos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalEnsayos}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Ensayos Aprobados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {ensayosAprobados}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Ensayos Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {ensayosPendientes}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Equipos Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {equiposActivos}/{totalEquipos}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No Conformidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {noConformidadesAbiertas}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder para gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-[240px] bg-white/90 dark:bg-slate-800/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Gráfico {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-full w-full bg-muted/40 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
