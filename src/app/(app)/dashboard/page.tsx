
import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Filter, Calendar as CalendarIcon, User, Package } from "lucide-react";
import { redirect } from 'next/navigation';

import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { EquipmentStatusChart } from "@/components/dashboard/equipment-status-chart";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { getEnsayos, getRecentActivity, getAnalystOptions } from "@/services/data-service";

export type DashboardFilterParams = {
  month?: string;
  analyst?: string;
  status?: string;
}

export default async function DashboardPage({ searchParams }: { searchParams: DashboardFilterParams }) {

  const { month = 'last_30_days', analyst = 'all', status = 'all' } = searchParams;
  
  // Fetch all data on the server
  const allEnsayos = await getEnsayos();
  const recentActivity = await getRecentActivity();
  const allAnalysts = await getAnalystOptions();
  
  // Apply filters on the server
  const filteredEnsayos = allEnsayos.filter(ensayo => {
    const filterByAnalyst = analyst === 'all' || ensayo.analista === analyst;
    const filterByStatus = status === 'all' || ensayo.estado.toLowerCase().replace(' ', '_') === status;
    // Note: Month filtering is simulated within charts, but could be applied here as well if needed.
    return filterByAnalyst && filterByStatus;
  });

  const activeSamples = filteredEnsayos.filter(e => e.estado === "En Progreso").length;
  const pendingAssays = filteredEnsayos.filter(e => e.estado === "Pendiente de Revisión").length;
  const approvedReports = filteredEnsayos.filter(e => e.estado === "Aprobado").length;
  
  const filters = { month, analyst, status };

  return (
    <div className="space-y-6">
      <DashboardFilters 
        analysts={allAnalysts} 
        defaultValues={{ month, analyst, status }} 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Muestras Activas"
          value={activeSamples.toString()}
          description="Muestras actualmente en proceso"
          icon={Activity}
        />
        <StatsCard
          title="Ensayos Pendientes"
          value={pendingAssays.toString()}
          description="Análisis esperando resultados"
          icon={ClipboardList}
        />
        <StatsCard
          title="Informes Aprobados"
          value={approvedReports.toString()}
          description="Certificados emitidos este mes"
          icon={CheckCircle}
        />
        <StatsCard
          title="Equipos Operativos"
          value="18 / 22"
          description="Equipos operativos y calibrados"
          icon={Beaker}
        />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SampleStatusChart data={filteredEnsayos} />
        </div>
        <RecentActivityList initialActivity={recentActivity}/>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssaysByMonthChart data={filteredEnsayos} filters={filters}/>
        <AssaysByTypeChart data={filteredEnsayos} filters={filters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThroughputTrendChart data={filteredEnsayos} filters={filters}/>
        </div>
        <div className="flex flex-col gap-6">
          <WorkloadDistributionChart data={filteredEnsayos} filters={filters}/>
          <EquipmentStatusChart />
        </div>
      </div>
    </div>
  );
}
