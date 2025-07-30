import { Activity, Beaker, CheckCircle, ClipboardList } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { InstrumentUsageList } from "@/components/dashboard/instrument-usage-list";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | PoliLIMS',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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
          title="Equipos Calibrados"
          value="18 / 22"
          description="Equipos operativos y calibrados"
          icon={Beaker}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SampleStatusChart />
        </div>
        <div>
          <RecentActivityList />
        </div>
      </div>
      
      <div>
        <InstrumentUsageList />
      </div>
    </div>
  );
}
