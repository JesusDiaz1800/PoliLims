
"use client";

import * as React from "react";
import { Target, Percent, Hourglass, Beaker, AlertOctagon, SlidersHorizontal } from "lucide-react";

import { StatsCard } from "@/components/main/stats-card";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
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
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { Button } from "@/components/ui/button";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export default function MainPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get('user') || 'jdiaz';

  const { 
    ensayos, 
    recentActivity, 
    equipos, 
    noConformidades, 
    isLoaded,
    filteredEnsayos,
    totalFilteredAssays,
    approvalPercentage,
    pendingAssays,
  } = useDynamicData();
  
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


  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;

  return (
    <div className="relative flex-1 space-y-6 min-h-screen">
       <div className="background-overlay"></div>
       <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:flex" />
                    <WelcomeBanner user={user} />
                </div>
                 <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="h-9 text-xs gap-2">
                            <SlidersHorizontal className="h-4 w-4"/>
                            Filtros
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <DashboardFilters
                            analysts={allAnalysts}
                            assayTypes={assayTypes}
                            suppliers={suppliers}
                        />
                    </CollapsibleContent>
                </Collapsible>
            </div>
            
            <div className="grid grid-cols-12 gap-6">
                
                <div className="col-span-12 lg:col-span-8">
                     <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <ThroughputTrendChart data={filteredEnsayos} />
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <EquipmentAlertsCard equipos={equipos || []} />
                    </Card>
                     <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <RecentActivityList initialActivity={recentActivity || []}/>
                    </Card>
                </div>
                
                 <div className="col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} />
                    <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
                    <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} />
                    <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} />
                    <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} />
                </div>

                 <div className="col-span-12 lg:col-span-6">
                    <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <AssaysByMonthChart data={ensayos || []} />
                    </Card>
                </div>
                 <div className="col-span-12 lg:col-span-6">
                    <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <NonConformitiesByMonthChart data={noConformidades || []} />
                    </Card>
                </div>

                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                     <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <AssaysByTypeChart data={filteredEnsayos} />
                    </Card>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                     <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <SampleStatusChart data={filteredEnsayos} />
                    </Card>
                </div>
                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                     <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <WorkloadDistributionChart data={filteredEnsayos} />
                    </Card>
                </div>
                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
                        <NonConformitiesByTypeChart data={noConformidades || []} />
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
