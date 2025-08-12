
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Target, Percent, Hourglass, AlertTriangle, AlertOctagon, Calendar, Download, Users, Briefcase, BarChart } from "lucide-react";
import { subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, getYear, startOfYear, endOfYear, subYears } from 'date-fns';

import { StatsCard } from "@/components/main/stats-card";
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
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';
import type { User } from "@/services/user-service";
import { NonConformitiesByMonthChart } from "@/components/dashboard/nc-by-month-chart";
import { NonConformitiesByTypeChart } from "@/components/dashboard/nc-by-type-chart";
import { useDynamicData } from "@/context/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

  const {
    filteredEnsayos,
    totalFilteredAssays,
    approvalPercentage,
    pendingAssays,
  } = React.useMemo(() => {
    if (!isLoaded || !ensayos) return { filteredEnsayos: [], totalFilteredAssays: 0, approvalPercentage: 0, pendingAssays: 0 };
    
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
  }, [ensayos, month, analyst, status, type, supplier, isLoaded]);

  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;

  return (
    <div className="dashboard-futurista relative flex-1 space-y-6 min-h-screen">
       <div className="background-overlay"></div>
       <div className="relative z-10 p-6 space-y-6">
          <WelcomeBanner user={user} />
          
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatsCard title="Total Ensayos (Período)" value={totalFilteredAssays.toString()} trend="+5.2% vs. mes anterior" trendDirection="up" icon={Target} />
                <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} trend="+1.2% vs. mes anterior" trendDirection="up" icon={Percent} />
                <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} trend="-3.4% vs. mes anterior" trendDirection="down" icon={Hourglass} />
                <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} trend="Estable" trendDirection="up" icon={Beaker} />
                <StatsCard title="NC Abiertas" value={openNcCount.toString()} trend="+2 nuevas esta semana" trendDirection="up" icon={AlertOctagon} />
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
                <div >
                    <AssaysByTypeChart data={filteredEnsayos} />
                </div>
                <div>
                    <SampleStatusChart data={filteredEnsayos} />
                </div>
                <div>
                    <WorkloadDistributionChart data={filteredEnsayos} />
                </div>
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
