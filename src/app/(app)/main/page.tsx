"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Target, Percent, Hourglass, Beaker, AlertOctagon, SlidersHorizontal, TrendingUp, Info } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import Loading from '../loading';
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import { useDynamicData, type Ensayo } from "@/context/data-context";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AssayTurnaroundTimeChart } from "@/components/dashboard/assay-turnaround-time-chart";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

export default function MainPage() {
  const searchParams = useSearchParams();

  const { 
    ensayos, 
    recentActivity, 
    equipos, 
    noConformidades, 
    proveedores,
    isLoaded,
    user,
  } = useDynamicData();
  
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // --- Start of KPI Calculation Logic ---
  const filteredEnsayos = React.useMemo(() => {
    if (!isLoaded) return [];
    
    const analystParam = 'all';
    const statusParam = 'all';
    const typeParam = 'all';

    return ensayos.filter(e => {
        try {
            const analystFilter = analystParam === 'all' || e.analista === analystParam;
            const typeFilter = typeParam === 'all' || e.tipo === typeParam;
            
            const statusFilter = statusParam === 'all' ||
                (statusParam === 'aprobado' && e.estado === 'Aprobado') ||
                (statusParam === 'rechazado' && e.estado === 'Rechazado') ||
                (statusParam === 'pendiente' && pendingStatuses.includes(e.estado));

            return analystFilter && typeFilter && statusFilter;
        } catch (error) {
            console.error("Error filtering assays:", error)
            return false;
        }
    });
  }, [ensayos, isLoaded]);

  const { totalFilteredAssays, approvalPercentage, pendingAssays } = React.useMemo(() => {
    const total = filteredEnsayos.length;
    if (total === 0) return { totalFilteredAssays: 0, approvalPercentage: 0, pendingAssays: 0 };
    
    const approved = filteredEnsayos.filter(e => e.estado === 'Aprobado').length;
    const pending = filteredEnsayos.filter(e => pendingStatuses.includes(e.estado)).length;
    
    const relevantTotal = filteredEnsayos.filter(e => e.estado === 'Aprobado' || e.estado === 'Rechazado').length;
    const percentage = relevantTotal > 0 ? (approved / relevantTotal) * 100 : 0;

    return { totalFilteredAssays: total, approvalPercentage: percentage, pendingAssays: pending };
  }, [filteredEnsayos]);
  // --- End of KPI Calculation Logic ---
  
  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const allAnalysts = Array.from(new Set(ensayos.map(e => e.analista).filter(Boolean)));
  const allAssayTypes = Array.from(new Set(ensayos.map(e => e.tipo).filter(Boolean)));
  const allSuppliers = Array.from(new Set(proveedores.map(p => p.nombre).filter(Boolean)));

  const analystOptions = [{ value: 'all', label: 'Todos los Analistas' }, ...allAnalysts.map(a => ({ value: a, label: a }))];
  const assayTypeOptions = [{ value: 'all', label: 'Todos los Tipos' }, ...allAssayTypes.map(t => ({ value: t, label: t }))];
  const supplierOptions = [{ value: 'all', label: 'Todos los Proveedores' }, ...allSuppliers.map(s => ({ value: s, label: s }))];
  
  const assayOptions = [
    { value: 'all', label: 'Todos los Ensayos' },
    { value: 'meltIndexCalculado', label: 'Melt Index' },
    { value: 'densidadCalculada', label: 'Densidad' },
    { value: 'resistencia_traccion', label: 'Resistencia a la Tracción' },
  ];

  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;

  return (
      <div className="relative flex-1 space-y-4 dashboard-futurista px-4 sm:px-6 lg:px-8 py-6">
        <div className="background-overlay"></div>
        <div className="relative z-10 space-y-4">
            <WelcomeBanner user={user} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} href="/ensayos/seguimiento" />
                <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
                <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} href="/ensayos/seguimiento?status=pendiente" />
                <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} href="/equipos"/>
                <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} href="/no-conformidades?status=abierta"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7">
                    <Card className="card-glass h-full">
                        <CardHeader>
                            <CardTitle>Ensayos por Mes</CardTitle>
                            <CardDescription>Volumen de ensayos en los últimos 12 meses.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[240px]">
                           <AssaysByMonthChart data={ensayos || []} />
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-5 space-y-4">
                    <Card className="card-glass">
                         <Collapsible
                            open={isFiltersOpen}
                            onOpenChange={setIsFiltersOpen}
                            className="p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Filtros del Dashboard
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-9 p-0">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <DashboardFilters
                                    analysts={analystOptions}
                                    assayTypes={assayTypeOptions}
                                    suppliers={supplierOptions}
                                    individualAssays={assayOptions}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <RecentActivityList initialActivity={recentActivity || []}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <Card className="card-glass h-full">
                    <CardHeader>
                        <CardTitle>Estados de Muestras</CardTitle>
                        <CardDescription>Distribución porcentual.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                        <SampleStatusChart data={filteredEnsayos} />
                    </CardContent>
                </Card>
                 <Card className="card-glass h-full">
                    <CardHeader>
                        <CardTitle>Carga de Trabajo</CardTitle>
                        <CardDescription>Distribución por analista.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                        <WorkloadDistributionChart data={filteredEnsayos} />
                    </CardContent>
                </Card>
                 <Card className="card-glass h-full">
                    <CardHeader>
                        <CardTitle>Distribución de Ensayos</CardTitle>
                        <CardDescription>Cantidad por tipo de producto.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                        <AssaysByTypeChart data={filteredEnsayos} />
                    </CardContent>
                </Card>
            </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="card-glass h-full">
                    <EquipmentAlertsCard equipos={equipos || []} />
                </Card>
                 <Card className="card-glass h-full">
                    <CardHeader>
                        <CardTitle>Tendencia de Rendimiento</CardTitle>
                        <CardDescription>Muestras recibidas vs. completadas en 30 días.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                       <ThroughputTrendChart data={ensayos || []} />
                    </CardContent>
                </Card>
                <Card className="card-glass h-full">
                    <CardHeader>
                        <CardTitle>No Conformidades por Tipo</CardTitle>
                        <CardDescription>Distribución de NCs.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                        <NonConformitiesByTypeChart data={noConformidades || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  );
}
