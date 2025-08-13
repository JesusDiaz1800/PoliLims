
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Target, Percent, Hourglass, Beaker, AlertOctagon } from "lucide-react";
import { subMonths, isAfter, parse } from 'date-fns';

import { StatsCard } from "@/components/main/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
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
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

export default function MainPage() {
  const searchParams = useSearchParams();
  const { 
    ensayos, 
    recentActivity, 
    equipos, 
    noConformidades, 
    isLoaded,
    user,
  } = useDynamicData();

  const filteredEnsayos = React.useMemo(() => {
    const now = new Date();
    const monthsParam = searchParams.get('month') || 'last_12_months';
    const analystParam = searchParams.get('analyst') || 'all';
    const statusParam = searchParams.get('status') || 'all';
    const typeParam = searchParams.get('type') || 'all';

    let dateLimit = subMonths(now, 12);
    if (monthsParam === 'last_30_days') dateLimit = subMonths(now, 1);
    if (monthsParam === 'this_month') dateLimit = new Date(now.getFullYear(), now.getMonth(), 1);

    return ensayos.filter(e => {
        try {
            const assayDate = parse(e.fecha, 'dd-MM-yyyy', new Date());
            if (isNaN(assayDate.getTime())) return false; // Skip invalid dates
            
            const dateFilter = isAfter(assayDate, dateLimit);
            const analystFilter = analystParam === 'all' || e.analista === analystParam;
            const typeFilter = typeParam === 'all' || e.tipo === typeParam;
            
            const statusFilter = statusParam === 'all' ||
                (statusParam === 'aprobado' && e.estado === 'Aprobado') ||
                (statusParam === 'rechazado' && e.estado === 'Rechazado') ||
                (statusParam === 'pendiente' && pendingStatuses.includes(e.estado));

            return dateFilter && analystFilter && typeFilter && statusFilter;
        } catch (error) {
            return false;
        }
    });
  }, [ensayos, searchParams]);
  
  const { totalFilteredAssays, approvalPercentage, pendingAssays } = React.useMemo(() => {
    const total = filteredEnsayos.length;
    if (total === 0) return { totalFilteredAssays: 0, approvalPercentage: 0, pendingAssays: 0 };
    
    const approved = filteredEnsayos.filter(e => e.estado === 'Aprobado').length;
    const pending = filteredEnsayos.filter(e => pendingStatuses.includes(e.estado)).length;
    
    const relevantTotal = filteredEnsayos.filter(e => e.estado === 'Aprobado' || e.estado === 'Rechazado').length;
    const percentage = relevantTotal > 0 ? (approved / relevantTotal) * 100 : 0;

    return { totalFilteredAssays: total, approvalPercentage: percentage, pendingAssays: pending };
  }, [filteredEnsayos]);
  
  const allAnalysts = React.useMemo(() => {
    if (!isLoaded || !ensayos) return [];
    const analystSet = new Set(ensayos.map(e => e.analista).filter(Boolean));
    return [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
  }, [ensayos, isLoaded]);

  const assayTypes = React.useMemo(() => {
    if (!isLoaded || !ensayos) return [];
    const typeSet = new Set(ensayos.map(e => e.tipo).filter(Boolean));
    return [{ value: "all", label: "Todos los Tipos" }, ...Array.from(typeSet).map(t => ({ value: t, label: t }))];
  }, [ensayos, isLoaded]);

  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <WelcomeBanner user={user} />
      <DashboardFilters analysts={allAnalysts} assayTypes={assayTypes} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} />
        <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
        <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} />
        <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} />
        <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <AssaysByMonthChart data={ensayos || []} />
        </Card>
        <Card className="col-span-3">
            <RecentActivityList initialActivity={recentActivity || []} />
        </Card>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <AssaysByTypeChart data={filteredEnsayos} />
          </Card>
          <Card>
            <SampleStatusChart data={filteredEnsayos} />
          </Card>
          <Card>
             <WorkloadDistributionChart data={filteredEnsayos} />
          </Card>
       </div>
    </div>
  );
}
