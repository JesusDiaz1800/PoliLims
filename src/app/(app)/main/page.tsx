
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Target, Percent, Hourglass, AlertTriangle, AlertOctagon, Calendar, Download, Users, Briefcase, BarChart } from "lucide-react";

import { StatsCard } from "@/components/main/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import { findUserByUsername } from "@/services/user-service";
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';
import type { User } from "@/services/user-service";
import { NonConformitiesByMonthChart } from "@/components/dashboard/nc-by-month-chart";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import { useDynamicData } from "@/context/data-context";

export default function MainPage() {
  const { ensayos, recentActivity, equipos, noConformidades, isLoaded } = useDynamicData();
  const searchParams = useSearchParams();
  
  const month = searchParams.get('month') || 'last_12_months';
  const analyst = searchParams.get('analyst') || 'all';
  const status = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const supplier = searchParams.get('supplier') || 'all';
  const username = searchParams.get('user') || 'jdiaz';

  const [user, setUser] = React.useState<User | null>(null);
  
  React.useEffect(() => {
    async function loadUser() {
        const userData = await findUserByUsername(username);
        setUser(userData);
    }
    if (username) {
      loadUser();
    }
  }, [username]);

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
  
  const suppliers = React.useMemo(() => {
      if (!isLoaded || !ensayos) return [];
      const supplierSet = new Set(ensayos.map(e => e.proveedor).filter(Boolean));
      return [{ value: "all", label: "Todos los Proveedores" }, ...Array.from(supplierSet).map(s => ({ value: s, label: s }))];
  }, [ensayos, isLoaded]);

  const {
    filteredEnsayos,
    totalFilteredAssays,
    approvalPercentage,
    pendingAssays,
  } = useDynamicData();

  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;

  return (
    <div className="relative flex-1 space-y-6 min-h-screen">
       <div className="background-overlay"></div>
       <div className="relative z-10 space-y-6">
          <WelcomeBanner user={user} />
          <DashboardFilters
            analysts={allAnalysts}
            assayTypes={assayTypes}
            suppliers={suppliers}
            defaultValues={{ month, analyst, status, type, supplier }}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard title="Total Ensayos (Período)" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} />
            <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
            <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} />
            <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} />
            <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AssaysByMonthChart data={ensayos || []} />
            </div>
            <div>
              <RecentActivityList initialActivity={recentActivity || []}/>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <ThroughputTrendChart data={filteredEnsayos} />
            </div>
            <div className="lg:col-span-2">
              <EquipmentAlertsCard equipos={equipos || []} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AssaysByTypeChart data={filteredEnsayos} />
            <SampleStatusChart data={filteredEnsayos} />
            <WorkloadDistributionChart data={filteredEnsayos} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <NonConformitiesByMonthChart data={noConformidades || []} />
            </div>
            <div className="md:col-span-2">
              <NonConformitiesByTypeChart data={noConformidades || []} />
            </div>
          </div>
        </div>
    </div>
  );
}
