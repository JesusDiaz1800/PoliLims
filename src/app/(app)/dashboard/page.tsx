import { Box, FlaskConical, Beaker, FileCheck2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SampleStatusChart } from "@/components/dashboard/sample-status-chart";
import { InstrumentUsageList } from "@/components/dashboard/instrument-usage-list";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Muestras Pendientes" value="128" description="+20.1% último mes" icon={Box} />
                <StatsCard title="Ensayos en Progreso" value="89" description="+18.3% último mes" icon={FlaskConical} />
                <StatsCard title="Equipos en Línea" value="4 / 5" description="1 equipo en mantenimiento" icon={Beaker} />
                <StatsCard title="Informes Aprobados" value="34" description="+5 desde ayer" icon={FileCheck2} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <SampleStatusChart />
                </div>
                <div className="lg:col-span-2">
                    <RecentActivityList />
                </div>
            </div>

            <div>
              <InstrumentUsageList />
            </div>
        </div>
    );
}
