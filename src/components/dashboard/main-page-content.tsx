
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Target, Percent, Hourglass, Beaker, AlertOctagon, SlidersHorizontal } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import { useDynamicData } from "@/context/data-context";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AssayTurnaroundTimeChart } from "@/components/dashboard/assay-turnaround-time-chart";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilters } from "@/context/filter-context";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

export default function MainPageContent() {
  const { theme } = useTheme();
  const { 
    ensayos, 
    recentActivity, 
    equipos, 
    noConformidades, 
    proveedores,
    user
  } = useDynamicData();

  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  const { filteredData: filteredEnsayos } = useFilters(ensayos, ['id', 'producto', 'analista', 'lote']);


  const { totalFilteredAssays, approvalPercentage, pendingAssays } = React.useMemo(() => {
    const total = filteredEnsayos.length;
    if (total === 0) return { totalFilteredAssays: 0, approvalPercentage: 0, pendingAssays: 0 };
    
    const approved = filteredEnsayos.filter(e => e.estado === 'Aprobado').length;
    const pending = filteredEnsayos.filter(e => pendingStatuses.includes(e.estado)).length;
    
    const relevantTotal = filteredEnsayos.filter(e => e.estado === 'Aprobado' || e.estado === 'Rechazado').length;
    const percentage = relevantTotal > 0 ? (approved / relevantTotal) * 100 : 0;

    return { totalFilteredAssays: total, approvalPercentage: percentage, pendingAssays: pending };
  }, [filteredEnsayos]);
  
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
  const openNcCount = (noConformidades || []).filter(nc => nc.estado === "Abierta").length;
  
  return (
    <div className={cn("flex-1 space-y-4", theme === 'dark' ? 'dashboard-futurista' : 'dashboard-light')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} href="/ensayos/seguimiento" trend="up" trendDirection="positive" />
            <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} trend="up" trendDirection="positive"/>
            <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} href="/ensayos/seguimiento?status=Pendiente" trend="down" trendDirection="negative" />
            <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} href="/equipos"/>
            <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} href="/no-conformidades?status=abierta" trend="up" trendDirection="negative"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <Card className="lg:col-span-8">
                <CardHeader>
                    <CardTitle>Ensayos por Mes</CardTitle>
                    <CardDescription>Volumen de ensayos en los últimos 12 meses.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                   <AssaysByMonthChart data={ensayos || []} />
                </CardContent>
            </Card>
            <Card className="lg:col-span-4">
                <CardHeader>
                    <Collapsible
                        open={isFiltersOpen}
                        onOpenChange={setIsFiltersOpen}
                        className="w-full"
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle>Filtros & Actividad</CardTitle>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle Filters</span>
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
                </CardHeader>
                <CardContent className="h-[240px]">
                    <RecentActivityList initialActivity={recentActivity || []}/>
                </CardContent>
            </Card>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            <Card className="h-full">
                <CardHeader><CardTitle>Registros por Analista</CardTitle><CardDescription>Cantidad de registros por analista.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><WorkloadDistributionChart data={filteredEnsayos} /></CardContent>
            </Card>
             <Card className="h-full">
                <CardHeader><CardTitle>Estado de Ensayos</CardTitle><CardDescription>Distribución porcentual.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><SampleStatusChart data={filteredEnsayos} /></CardContent>
            </Card>
            <Card className="h-full">
                <CardHeader><CardTitle>Distribución de Ensayos</CardTitle><CardDescription>Cantidad por tipo de producto.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><AssaysByTypeChart data={filteredEnsayos} /></CardContent>
            </Card>
             <Card className="h-full">
                <CardHeader>
                    <CardTitle>Alertas de Equipos</CardTitle>
                    <CardDescription>Equipos que requieren atención inmediata.</CardDescription>
                </CardHeader>
                <EquipmentAlertsCard equipos={equipos || []} />
            </Card>
        </div>
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Card className="h-full">
                <CardHeader><CardTitle>Tendencia de Rendimiento</CardTitle><CardDescription>Muestras recibidas vs. completadas.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><ThroughputTrendChart data={ensayos || []} /></CardContent>
            </Card>
            <Card className="h-full">
                <CardHeader><CardTitle>Tiempo de Respuesta Promedio</CardTitle><CardDescription>Días desde recepción a finalización.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><AssayTurnaroundTimeChart data={ensayos || []} /></CardContent>
            </Card>
            <Card className="h-full">
                <CardHeader><CardTitle>No Conformidades</CardTitle><CardDescription>Distribución por tipo de origen.</CardDescription></CardHeader>
                <CardContent className="h-[240px]"><NonConformitiesByTypeChart data={noConformidades || []} /></CardContent>
            </Card>
        </div>
    </div>
  );
}
