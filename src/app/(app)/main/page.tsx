
"use client";

import * as React from "react";
import { Target, Percent, Hourglass, Beaker, AlertOctagon } from "lucide-react";
import { subMonths, isAfter, parse } from 'date-fns';

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import Loading from '../loading';
import type { User } from "@/services/user-service";
import { useDynamicData } from "@/context/data-context";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { AssayTurnaroundTimeChart } from "@/components/dashboard/assay-turnaround-time-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartModal } from "@/components/dashboard/chart-modal";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

export default function MainPage() {
  const { 
    ensayos, 
    recentActivity, 
    equipos, 
    noConformidades, 
    proveedores,
    isLoaded,
    user,
  } = useDynamicData();

  const [modalContent, setModalContent] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

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
    <>
    <div className="flex-1 space-y-4">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0 background-overlay"></div>
      <div className="relative z-10 p-8 pt-6">
        <WelcomeBanner user={user} />
        <DashboardFilters 
          analysts={analystOptions} 
          assayTypes={assayTypeOptions} 
          suppliers={supplierOptions} 
          individualAssays={assayOptions}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-4">
          <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} href="/ensayos/seguimiento"/>
          <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
          <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} href="/ensayos/seguimiento?status=pendiente" />
          <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} href="/equipos"/>
          <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} href="/no-conformidades?status=abierta"/>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <ChartCard className="col-span-4" title="Ensayos por Mes" onExpand={() => setModalContent({ title: 'Ensayos por Mes', children: <AssaysByMonthChart data={ensayos || []} isModal /> })}>
            <AssaysByMonthChart data={ensayos || []} />
          </ChartCard>
           <div className="col-span-3">
              <RecentActivityList initialActivity={recentActivity || []} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <ChartCard title="Ensayos por Tipo" onExpand={() => setModalContent({ title: 'Ensayos por Tipo', children: <AssaysByTypeChart data={filteredEnsayos} isModal /> })}>
                <AssaysByTypeChart data={filteredEnsayos} />
            </ChartCard>
             <ChartCard title="Estado de Muestras" onExpand={() => setModalContent({ title: 'Estado de Muestras', children: <SampleStatusChart data={filteredEnsayos} isModal /> })}>
                <SampleStatusChart data={filteredEnsayos} />
            </ChartCard>
            <ChartCard title="Carga de Trabajo" onExpand={() => setModalContent({ title: 'Distribución de Carga de Trabajo', children: <WorkloadDistributionChart data={filteredEnsayos} isModal /> })}>
                <WorkloadDistributionChart data={filteredEnsayos} />
            </ChartCard>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <ChartCard className="col-span-1 md:col-span-2" title="Tiempo de Respuesta Promedio" onExpand={() => setModalContent({ title: 'Tiempo de Respuesta Promedio', children: <AssayTurnaroundTimeChart data={ensayos} isModal /> })}>
                <AssayTurnaroundTimeChart data={ensayos} />
            </ChartCard>
             <ChartCard title="Origen de No Conformidades" onExpand={() => setModalContent({ title: 'Origen de No Conformidades', children: <NonConformitiesByTypeChart data={noConformidades} isModal /> })}>
              <NonConformitiesByTypeChart data={noConformidades}/>
           </ChartCard>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mt-4">
           <ChartCard className="col-span-1 md:col-span-2 lg:col-span-4" title="Tendencia de Rendimiento" onExpand={() => setModalContent({ title: 'Tendencia de Rendimiento', children: <ThroughputTrendChart data={ensayos} isModal /> })}>
             <ThroughputTrendChart data={ensayos}/>
           </ChartCard>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <EquipmentAlertsCard equipos={equipos} />
           </div>
         </div>
      </div>
    </div>
     <ChartModal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
        title={modalContent?.title || ''}
      >
        {modalContent?.children}
      </ChartModal>
    </>
  );
}
