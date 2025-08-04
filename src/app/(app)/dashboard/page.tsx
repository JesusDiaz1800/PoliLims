
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Target, Percent, Hourglass } from "lucide-react";
import { subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, getYear, startOfYear, endOfYear } from 'date-fns';

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
  type?: string;
  supplier?: string;
}

export default function DashboardPage() {
  const { ensayos, isLoading, recentActivity, equipos } = useDynamicData();
  const searchParams = useSearchParams();
  
  const month = searchParams.get('month') || 'last_30_days';
  const analyst = searchParams.get('analyst') || 'all';
  const status = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const supplier = searchParams.get('supplier') || 'all';
  const username = searchParams.get('user') || 'jefe.calidad';

  const [user, setUser] = React.useState<User | null>(null);
  const [allAnalysts, setAllAnalysts] = React.useState<{value: string, label: string}[]>([]);
  const [assayTypes, setAssayTypes] = React.useState<{value: string, label: string}[]>([]);
  const [suppliers, setSuppliers] = React.useState<{value: string, label: string}[]>([]);


  React.useEffect(() => {
    async function loadUserAndFilters() {
        const userData = await findUserByUsername(username);
        setUser(userData);
        
        const analystSet = new Set(ensayos.map(e => e.analista).filter(Boolean));
        const analystOptions = [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
        setAllAnalysts(analystOptions);

        const typeSet = new Set(ensayos.map(e => e.tipo).filter(Boolean));
        const typeOptions = [{ value: "all", label: "Todos los Tipos" }, ...Array.from(typeSet).map(t => ({ value: t, label: t }))];
        setAssayTypes(typeOptions);

        const supplierSet = new Set(ensayos.map(e => e.proveedor).filter(Boolean));
        const supplierOptions = [{ value: "all", label: "Todos los Proveedores" }, ...Array.from(supplierSet).map(s => ({ value: s, label: s }))];
        setSuppliers(supplierOptions);
    }
    if (username && ensayos.length > 0) {
      loadUserAndFilters();
    }
  }, [username, ensayos]);
  
  if (isLoading || !user) {
    return <Loading />;
  }
  
  const now = new Date();
  
  // Filtered data calculation
  const filteredEnsayos = ensayos.filter(ensayo => {
    const ensayoDate = parseISO(ensayo.fecha);

    let dateRange = { start: new Date(0), end: now };
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
    }

    const isDateInRange = isWithinInterval(ensayoDate, dateRange);
    const filterByAnalyst = analyst === 'all' || ensayo.analista === analyst;
    const filterByStatus = status === 'all' || ensayo.estado.toLowerCase().replace(/\s/g, '_') === status;
    const filterByType = type === 'all' || ensayo.tipo === type;
    const filterBySupplier = supplier === 'all' || ensayo.proveedor === supplier;
    
    return isDateInRange && filterByAnalyst && filterByStatus && filterByType && filterBySupplier;
  });

  const totalFilteredAssays = filteredEnsayos.length;
  const approvedAssays = filteredEnsayos.filter(e => e.estado === "Aprobado").length;
  const rejectedAssays = filteredEnsayos.filter(e => e.estado === "Rechazado").length;
  const finishedAssays = approvedAssays + rejectedAssays;
  
  const pendingAssays = filteredEnsayos.filter(e => ["En Progreso", "En Análisis", "Pendiente de Revisión"].includes(e.estado)).length;
  
  const approvalPercentage = finishedAssays > 0 ? (approvedAssays / finishedAssays) * 100 : 0;
  const pendingPercentage = totalFilteredAssays > 0 ? (pendingAssays / totalFilteredAssays) * 100 : 0;

  const operationalEquipment = equipos.filter(e => e.estado === "Activo").length;
  const totalEquipment = equipos.length;

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />
      <DashboardFilters 
        analysts={allAnalysts} 
        assayTypes={assayTypes}
        suppliers={suppliers}
        defaultValues={{ month, analyst, status, type, supplier }} 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Ensayos (Período)"
          value={totalFilteredAssays.toString()}
          description="Ensayos en el período y filtro actual"
          icon={Target}
        />
        <StatsCard
          title="% Aprobación"
          value={`${approvalPercentage.toFixed(1)}%`}
          description="De ensayos finalizados en el período"
          icon={Percent}
        />
        <StatsCard
          title="Ensayos Pendientes"
          value={`${pendingAssays}`}
          description="Ensayos activos que requieren acción"
          icon={Hourglass}
        />
        <StatsCard
          title="Equipos Operativos"
          value={`${operationalEquipment} / ${totalEquipment}`}
          description="Equipos calibrados y activos"
          icon={Beaker}
        />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <WorkloadDistributionChart data={filteredEnsayos} />
        </div>
        <RecentActivityList initialActivity={recentActivity}/>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssaysByMonthChart data={filteredEnsayos} />
        <AssaysByTypeChart data={filteredEnsayos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThroughputTrendChart data={filteredEnsayos} />
        </div>
        <div className="flex flex-col gap-6">
          <SampleStatusChart data={filteredEnsayos} />
          <EquipmentStatusChart data={equipos} />
        </div>
      </div>
    </div>
  );

    