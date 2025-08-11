
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Target, Percent, Hourglass, AlertTriangle, AlertOctagon } from "lucide-react";
import { subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, getYear, startOfYear, endOfYear, subYears } from 'date-fns';

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
import { EquipmentAlertsCard } from "@/components/dashboard/equipment-alerts-card";
import { findUserByUsername } from "@/services/user-service";
import * as dataService from "@/services/data-service";
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';
import type { User } from "@/services/user-service";
import { NonConformitiesByMonthChart } from "@/components/dashboard/nc-by-month-chart";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import type { Ensayo, RecentActivity, Equipo, NoConformidad } from "@/context/data-context";

export type DashboardFilterParams = {
  month?: string;
  analyst?: string;
  status?: string;
  user?: string;
  type?: string;
  supplier?: string;
}

export default function DashboardPage() {
  const [ensayos, setEnsayos] = React.useState<Ensayo[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<RecentActivity[]>([]);
  const [equipos, setEquipos] = React.useState<Equipo[]>([]);
  const [noConformidades, setNoConformidades] = React.useState<NoConformidad[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const searchParams = useSearchParams();
  
  const month = searchParams.get('month') || 'last_12_months';
  const analyst = searchParams.get('analyst') || 'all';
  const status = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const supplier = searchParams.get('supplier') || 'all';
  const username = searchParams.get('user') || 'jdiaz';

  const [user, setUser] = React.useState<User | null>(null);
  
  const allAnalysts = React.useMemo(() => {
    if (isLoading) return [];
    const analystSet = new Set(ensayos.map(e => e.analista).filter(Boolean));
    return [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
  }, [ensayos, isLoading]);

  const assayTypes = React.useMemo(() => {
    if (isLoading) return [];
    const typeSet = new Set(ensayos.map(e => e.tipo).filter(Boolean));
    return [{ value: "all", label: "Todos los Tipos" }, ...Array.from(typeSet).map(t => ({ value: t, label: t }))];
  }, [ensayos, isLoading]);
  
  const suppliers = React.useMemo(() => {
      if (isLoading) return [];
      const supplierSet = new Set(ensayos.map(e => e.proveedor).filter(Boolean));
      return [{ value: "all", label: "Todos los Proveedores" }, ...Array.from(supplierSet).map(s => ({ value: s, label: s }))];
  }, [ensayos, isLoading]);


  React.useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const userData = await findUserByUsername(username);
        setUser(userData);

        const { ensayos: fetchedEnsayos, recentActivity: fetchedActivity, equipos: fetchedEquipos, noConformidades: fetchedNCs } = await dataService.getInitialData();
        setEnsayos(fetchedEnsayos);
        setRecentActivity(fetchedActivity);
        setEquipos(fetchedEquipos);
        setNoConformidades(fetchedNCs);

        setIsLoading(false);
    }
    if (username) {
      loadData();
    }
  }, [username]);
  
  const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

  // Memoize filtered data and calculations to improve performance
  const {
    filteredEnsayos,
    totalFilteredAssays,
    approvalPercentage,
    pendingAssays,
  } = React.useMemo(() => {
    if (isLoading) return { filteredEnsayos: [], totalFilteredAssays: 0, approvalPercentage: 0, pendingAssays: 0 };
    
    const now = new Date();
    
    const filtered = ensayos.filter(ensayo => {
      let ensayoDate;
      try {
        ensayoDate = parseISO(ensayo.fecha.split('-').reverse().join('-'));
      } catch (error) {
        console.warn(`Invalid date format for ensayo ${ensayo.id}: ${ensayo.fecha}`);
        return false;
      }
      
      let dateRange = { start: subYears(now, 10), end: now };
      if (month === 'last_30_days') {
          dateRange = { start: subDays(now, 29), end: now };
      } else if (month === 'this_month') {
          dateRange = { start: startOfMonth(now), end: endOfMonth(now) };
      } else if (month === 'last_month') {
          const lastMonthStart = startOfMonth(subMonths(now, 1));
          const lastMonthEnd = endOfMonth(subMonths(now, 1));
          dateRange = { start: lastMonthStart, end: lastMonthEnd };
      } else if (month === 'last_3_months') {
          dateRange = { start: subMonths(now, 3), end: now };
      } else if (month === 'last_12_months') {
          dateRange = { start: subYears(now, 1), end: now };
      }

      const isDateInRange = isWithinInterval(ensayoDate, dateRange);
      const filterByAnalyst = analyst === 'all' || ensayo.analista === analyst;

      let filterByStatus = true;
      if (status !== 'all') {
          if (status === 'pendiente') {
              filterByStatus = pendingStatuses.includes(ensayo.estado);
          } else {
              filterByStatus = ensayo.estado.toLowerCase().replace(/\s/g, '_') === status;
          }
      }
      
      const filterByType = type === 'all' || ensayo.tipo === type;
      const filterBySupplier = supplier === 'all' || ensayo.proveedor === supplier;
      
      return isDateInRange && filterByAnalyst && filterByStatus && filterByType && filterBySupplier;
    });

    const totalFiltered = filtered.length;
    const approved = filtered.filter(e => e.estado === "Aprobado").length;
    const rejected = filtered.filter(e => e.estado === "Rechazado").length;
    const finished = approved + rejected;
    
    const pending = filtered.filter(e => pendingStatuses.includes(e.estado)).length;
    
    const approval = finished > 0 ? (approved / finished) * 100 : 0;
    
    return {
        filteredEnsayos: filtered,
        totalFilteredAssays: totalFiltered,
        approvalPercentage: approval,
        pendingAssays: pending,
    }
  }, [ensayos, month, analyst, status, type, supplier, isLoading]);

  if (isLoading || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = equipos.filter(e => e.estado === "Activo").length;
  const totalEquipment = equipos.length;
  const openNcCount = noConformidades.filter(nc => nc.estado !== "Cerrada").length;

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />
      <DashboardFilters 
        analysts={allAnalysts} 
        assayTypes={assayTypes}
        suppliers={suppliers}
        defaultValues={{ month, analyst, status, type, supplier }} 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Ensayos (Período)" value={totalFilteredAssays.toString()} description="Ensayos en el período y filtro actual" icon={Target} />
        <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="De ensayos finalizados en el período" icon={Percent} />
        <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="Ensayos activos que requieren acción" icon={Hourglass} />
        <StatsCard title="Equipos Operativos" value={`${operationalEquipment} / ${totalEquipment}`} description="Equipos calibrados y activos" icon={Beaker} />
        <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="No conformidades que requieren acción" icon={AlertOctagon} href="/no-conformidades" />
      </div>
      
      <div className="grid grid-cols-12 gap-6 lg:grid-rows-1">
        <div className="col-span-12 lg:col-span-8">
          <AssaysByMonthChart data={ensayos} />
        </div>
        <div className="col-span-12 lg:col-span-4">
            <RecentActivityList initialActivity={recentActivity}/>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6 lg:items-start">
        <div className="col-span-12 lg:col-span-8">
            <ThroughputTrendChart data={filteredEnsayos} />
        </div>
        <div className="col-span-12 lg:col-span-4">
            <EquipmentAlertsCard equipos={equipos} />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <AssaysByTypeChart data={filteredEnsayos} />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <SampleStatusChart data={filteredEnsayos} />
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-4">
          <WorkloadDistributionChart data={filteredEnsayos} />
        </div>
      </div>

       <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
            <NonConformitiesByMonthChart data={noConformidades} />
        </div>
        <div className="col-span-12 lg:col-span-4">
            <NonConformitiesByTypeChart data={noConformidades} />
        </div>
      </div>
    </div>
  );
}

    