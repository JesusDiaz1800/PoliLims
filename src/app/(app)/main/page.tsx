
"use client";

import { BarChart, Briefcase, Calendar, DollarSign, Download, Users } from "lucide-react";
import { StatsCard } from "@/components/main/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MainPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Main Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Julio 2025</span>
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ingresos Totales"
          value="$45,231.89"
          icon={DollarSign}
          trend="+20.1% desde el mes pasado"
          trendDirection="up"
        />
        <StatsCard
          title="Suscripciones"
          value="+2350"
          icon={Users}
          trend="+180.1% desde el mes pasado"
          trendDirection="up"
        />
        <StatsCard
          title="Ventas"
          value="+12,234"
          icon={Briefcase}
          trend="+19% desde el mes pasado"
          trendDirection="up"
        />
        <StatsCard
          title="Tasa de Aprobación"
          value="92.8%"
          icon={BarChart}
          trend="-1.2% desde la semana pasada"
          trendDirection="down"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader>
            <CardTitle>Rendimiento General</CardTitle>
            <CardDescription>
              Análisis de los últimos 12 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
             {/* Placeholder for Bar Chart */}
             <div className="text-muted-foreground">Bar Chart Placeholder</div>
          </CardContent>
        </Card>
        <Card className="col-span-12 lg:col-span-5">
           <CardHeader>
            <CardTitle>Distribución de Ensayos</CardTitle>
            <CardDescription>
              Distribución por tipo de ensayo este mes.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {/* Placeholder for Donut Chart */}
            <div className="text-muted-foreground">Donut Chart Placeholder</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ensayos Recientes</CardTitle>
          <CardDescription>
            Listado de los últimos ensayos procesados en el laboratorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Placeholder for Advanced Table */}
           <div className="text-muted-foreground h-48 flex items-center justify-center">Advanced Table Placeholder</div>
        </CardContent>
      </Card>
    </div>
  );
}
