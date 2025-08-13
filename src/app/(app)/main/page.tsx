

"use client";

import * as React from "react";
import { Target, Percent, Hourglass, Beaker, AlertOctagon, SlidersHorizontal, TestTube } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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
import { useDynamicData, type Ensayo } from "@/context/data-context";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { Card } from "@/components/ui/card";
import { AssayTurnaroundTimeChart } from "@/components/dashboard/assay-turnaround-time-chart";


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
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  
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
  
  const individualAssays = React.useMemo(() => [
      { value: "all", label: "Todos los Ensayos" },
      { value: "meltIndexCalculado", label: "Melt Index" },
      { value: "densidadCalculada", label: "Densidad" },
      { value: "resistencia_traccion", label: "Tracción" },
      { value: "negroHumoCalculado", label: "% Negro de Humo" },
      { value: "tio_tiempo", label: "TIO" },
  ], []);


  if (!isLoaded || !user) {
    return <Loading />;
  }
  
  const operationalEquipment = (equipos || []).filter(e => e.estado === "Activo").length;
  const totalEquipment = (equipos || []).length;
  const openNcCount = (noConformidades || []).filter(nc => nc.estado !== "Cerrada").length;
  const userQuery = searchParams.toString();

  return (
    <div className="relative flex-1 space-y-4">
       <div className="background-overlay"></div>
       <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <WelcomeBanner user={user} />
                </div>
                <Card className="card-glass lg:col-span-2">
                     <Collapsible
                        open={isFiltersOpen}
                        onOpenChange={setIsFiltersOpen}
                        className="p-2"
                    >
                        <div className="flex items-center justify-center">
                            <h4 className="flex-1 text-sm font-semibold text-center ml-9">
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
                                analysts={allAnalysts}
                                assayTypes={assayTypes}
                                suppliers={suppliers}
                                individualAssays={individualAssays}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard title="Total Ensayos" value={totalFilteredAssays.toString()} description="+5.2% vs. mes anterior" icon={Target} href={`/ensayos/seguimiento?${userQuery}`} />
                <StatsCard title="% Aprobación" value={`${approvalPercentage.toFixed(1)}%`} description="+1.2% vs. mes anterior" icon={Percent} />
                <StatsCard title="Ensayos Pendientes" value={`${pendingAssays}`} description="-3.4% vs. mes anterior" icon={Hourglass} href={`/ensayos/seguimiento?status=pendiente&${userQuery}`} />
                <StatsCard title="Equipos Operativos" value={`${operationalEquipment}/${totalEquipment}`} description="Estado de la flota" icon={Beaker} href={`/equipos?${userQuery}`} />
                <StatsCard title="NC Abiertas" value={openNcCount.toString()} description="+2 nuevas esta semana" icon={AlertOctagon} href={`/no-conformidades?status=abierta&${userQuery}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <Card className="lg:col-span-6 h-[300px] card-glass">
                    <AssaysByMonthChart data={ensayos || []} />
                </Card>
                <Card className="lg:col-span-6 h-[300px] card-glass">
                    <ThroughputTrendChart data={filteredEnsayos} />
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="h-[280px] card-glass">
                    <AssaysByTypeChart data={filteredEnsayos} />
                </Card>
                <Card className="h-[280px] card-glass">
                    <SampleStatusChart data={filteredEnsayos} />
                </Card>
                <Card className="h-[280px] card-glass">
                    <WorkloadDistributionChart data={filteredEnsayos} />
                </Card>
                <Card className="h-[280px] card-glass">
                    <RecentActivityList initialActivity={recentActivity || []}/>
                </Card>
            </div>
             
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <Card className="lg:col-span-4 h-[280px] card-glass">
                    <EquipmentAlertsCard equipos={equipos || []} />
                </Card>
                 <Card className="lg:col-span-4 h-[280px] card-glass">
                    <NonConformitiesByMonthChart data={noConformidades || []} />
                </Card>
                 <Card className="lg:col-span-4 h-[280px] card-glass">
                    <AssayTurnaroundTimeChart data={ensayos || []} />
                </Card>
            </div>

        </div>
    </div>
  );
}
