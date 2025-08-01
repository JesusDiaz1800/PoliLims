
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { EquipmentStatusChart } from "@/components/dashboard/equipment-status-chart";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { findUserByUsername } from "@/services/user-service";
import { useDynamicData } from "@/context/data-context";
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';
import type { User } from "@/services/user-service";

export type DashboardFilterParams = {
  month?: string;
  analyst?: string;
  status?: string;
  user?: string;
}

export default function DashboardPage() {
  const { ensayos, isLoading, recentActivity, equipos } = useDynamicData();
  const searchParams = useSearchParams();
  
  const month = searchParams.get('month') || 'last_30_days';
  const analyst = searchParams.get('analyst') || 'all';
  const status = searchParams.get('status') || 'all';
  const username = searchParams.get('user') || 'jefe.calidad';

  const [user, setUser] = React.useState<User | null>(null);
  const [allAnalysts, setAllAnalysts] = React.useState<{value: string, label: string}[]>([]);

  React.useEffect(() => {
    async function loadUserAndAnalysts() {
        const userData = await findUserByUsername(username);
        setUser(userData);
        
        const analystSet = new Set(ensayos.map(e => e.analista).filter(Boolean)); // Filter out empty/null/undefined analyst names
        const analystOptions = [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
        setAllAnalysts(analystOptions);
    }
    if (username && ensayos.length > 0) {
      loadUserAndAnalysts();
    }
  }, [username, ensayos]);
  
  if (isLoading || !user) {
    return <Loading />;
  }

  // Apply filters
  const filteredEnsayos = ensayos.filter(ensayo => {
    const filterByAnalyst = analyst === 'all' || ensayo.analista === analyst;
    const filterByStatus = status === 'all' || ensayo.estado.toLowerCase().replace(/\s/g, '_') === status;
    // Note: Month filtering is simulated within charts for now
    return filterByAnalyst && filterByStatus;
  });

  const activeSamples = filteredEnsayos.filter(e => e.estado === "En Progreso").length;
  const pendingAssays = filteredEnsayos.filter(e => e.estado === "Pendiente de Revisión").length;
  const approvedReports = filteredEnsayos.filter(e => e.estado === "Aprobado").length;
  
  const operationalEquipment = equipos.filter(e => e.estado === "Activo").length;
  const totalEquipment = equipos.length;

  const filters = { month, analyst, status };

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />
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
          value={`${operationalEquipment} / ${totalEquipment}`}
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
          <EquipmentStatusChart data={equipos} />
        </div>
      </div>
    </div>
  );
}
