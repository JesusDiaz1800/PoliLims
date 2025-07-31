
"use client";

import * as React from "react";
import { Activity, Beaker, CheckCircle, ClipboardList, Filter, Calendar as CalendarIcon, User, Package } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { ThroughputTrendChart } from "@/components/dashboard/throughput-trend-chart";
import { EquipmentStatusChart } from "@/components/dashboard/equipment-status-chart";
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

export default function DashboardPage() {
  const [filters, setFilters] = React.useState({
    month: "last_30_days",
    analyst: "all",
    status: "all"
  });

  const handleFilterChange = (filterName: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

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
                              <SelectItem value="all">Todos los Analistas</SelectItem>
                              <SelectItem value="jesus.diaz">Jesus Diaz</SelectItem>
                              <SelectItem value="maximiliano.miranda">Maximiliano Miranda</SelectItem>
                              <SelectItem value="antonia.figueroa">Antonia Figueroa</SelectItem>
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
                          </SelectContent>
                      </Select>
                  </div>
              </div>
          </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Muestras Activas"
          value="152"
          description="Muestras actualmente en proceso"
          icon={Activity}
        />
        <StatsCard
          title="Ensayos Pendientes"
          value="32"
          description="Análisis esperando resultados"
          icon={ClipboardList}
        />
        <StatsCard
          title="Informes Aprobados"
          value="45"
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
          <SampleStatusChart />
        </div>
        <RecentActivityList />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThroughputTrendChart />
        </div>
        <div className="flex flex-col gap-6">
          <WorkloadDistributionChart />
          <EquipmentStatusChart />
        </div>
      </div>
    </div>
  );
}
