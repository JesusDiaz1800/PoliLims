"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Target, Percent, Hourglass, Beaker, AlertOctagon, Expand, SlidersHorizontal } from "lucide-react";
import { subMonths, isAfter, parse } from 'date-fns';

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import Loading from '../loading';
import type { User } from "@/services/user-service";
import { NonConformitiesByMonthChart } from "@/components/dashboard/nc-by-month-chart";
import { useDynamicData, type Ensayo } from "@/context/data-context";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { Card } from "@/components/ui/card";
import { AssayTurnaroundTimeChart } from "@/components/dashboard/assay-turnaround-time-chart";
import { ChartModal } from "@/components/dashboard/chart-modal";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const ChartCard = ({ title, children, className }: { title: string; children: React.ReactNode, className?: string }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Card className="h-full card-glass relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground/90">{title}</h3>
            <div className="mt-4 h-[240px]">
                {children}
            </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Expand className="h-4 w-4 text-white/70" />
        </div>
      </Card>
      <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={title}>
        <div className="w-full h-full p-4">{children}</div>
      </ChartModal>
    </>
  );
};


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
                <div className="lg:col-span-8">
                    <ChartCard title="Ensayos por Mes (Últimos 12 meses)">
                        <AssaysByMonthChart data={ensayos || []} />
                    </ChartCard>
                </div>
                 <div className="lg:col-span-4">
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
                    <div className="mt-4">
                        <ChartCard title="Distribución de Estados de Muestras">
                             <SampleStatusChart data={filteredEnsayos} />
                        </ChartCard>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <ChartCard title="Distribución de Tipos de Ensayo">
                    <AssaysByTypeChart data={filteredEnsayos} />
                </ChartCard>
                <ChartCard title="Distribución de Carga de Trabajo">
                     <WorkloadDistributionChart data={filteredEnsayos} />
                </ChartCard>
                 <Card className="card-glass h-[312px]">
                    <RecentActivityList initialActivity={recentActivity || []}/>
                </Card>
            </div>
             
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4">
                    <Card className="h-[312px] card-glass">
                        <EquipmentAlertsCard equipos={equipos || []} />
                    </Card>
                </div>
                <div className="lg:col-span-4">
                    <ChartCard title="No Conformidades por Tipo">
                        <NonConformitiesByTypeChart data={noConformidades || []} />
                    </ChartCard>
                </div>
                 <div className="lg:col-span-4">
                     <ChartCard title="Tiempo de Respuesta Promedio por Ensayo">
                        <AssayTurnaroundTimeChart data={ensayos || []} />
                    </ChartCard>
                </div>
            </div>
        </div>
      </div>
  );
}
