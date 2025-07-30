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
                <StatsCard title="Samples Pending" value="128" description="+20.1% from last month" icon={Box} />
                <StatsCard title="Tests in Progress" value="89" description="+18.3% from last month" icon={FlaskConical} />
                <StatsCard title="Instruments Online" value="4 / 5" description="1 instrument in maintenance" icon={Beaker} />
                <StatsCard title="Reports Approved" value="34" description="+5 since yesterday" icon={FileCheck2} />
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
