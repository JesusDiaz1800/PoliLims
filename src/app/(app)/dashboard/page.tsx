
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Filter, Calendar as CalendarIcon, User, Package } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { EquipmentStatusChart } from "@/components/dashboard/equipment-status-chart";
import { AssaysByMonthChart } from "@/components/dashboard/assays-by-month-chart";
import { AssaysByTypeChart } from "@/components/dashboard/assays-by-type-chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useDataContext } from "@/context/data-context";

export type DashboardFilters = {
  month: string;
  analyst: string;
  status: string;
}

export default function DashboardPage() {
  const { ensayos } = useDataContext();
  const [filters, setFilters] = React.useState<DashboardFilters>({
    month: "last_30_days",
    analyst: "all",
    status: "all"
  });

  const handleFilterChange = (filterName: keyof DashboardFilters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const filteredEnsayos = React.useMemo(() => {
    return ensayos.filter(ensayo => {
      const filterByAnalyst = filters.analyst === 'all' || ensayo.analista === filters.analyst;
      const filterByStatus = filters.status === 'all' || ensayo.estado.toLowerCase().replace(' ', '_') === filters.status;
      // Note: Month filter simulation is handled within each chart for now
      return filterByAnalyst && filterByStatus;
    });
  }, [ensayos, filters]);

  const activeSamples = filteredEnsayos.filter(e => e.estado === "En Progreso").length;
  const pendingAssays = filteredEnsayos.filter(e => e.estado === "Pendiente de Revisión").length;
  const approvedReports = filteredEnsayos.filter(e => e.estado === "Aprobado").length;


  const allAnalysts = React.useMemo(() => {
    const analystSet = new Set(ensayos.map(e => e.analista));
    return [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
  }, [ensayos]);


  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5">
                      <CardTitle>Filtros del Dashboard</CardTitle>
                      <CardDescription>Seleccione los filtros para visualizar los datos del laboratorio.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                      <Select value={filters.month} onValueChange={handleFilterChange("month")}>
                          <SelectTrigger className="w-[180px]">
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Filtrar por mes" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                              <SelectItem value="this_month">Este Mes</SelectItem>
                              <SelectItem value="last_month">Mes Pasado</SelectItem>
                              <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                          </SelectContent>
                      </Select>
                      <Select value={filters.analyst} onValueChange={handleFilterChange("analyst")}>
                          <SelectTrigger className="w-[180px]">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Filtrar por analista" />
                          </SelectTrigger>
                          <SelectContent>
                              {allAnalysts.map(analyst => (
                                <SelectItem key={analyst.value} value={analyst.value}>{analyst.label}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                       <Select value={filters.status} onValueChange={handleFilterChange("status")}>
                          <SelectTrigger className="w-[180px]">
                              <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Filtrar por estado" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">Todos los Estados</SelectItem>
                              <SelectItem value="aprobado">Aprobado</SelectItem>
                              <SelectItem value="en_progreso">En Progreso</SelectItem>
                              <SelectItem value="rechazado">Rechazado</SelectItem>
                               <SelectItem value="pendiente_de_revision">Pendiente de Revisión</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
          </CardHeader>
      </Card>

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
        <RecentActivityList />
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
