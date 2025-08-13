
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import type { Ensayo } from "@/context/data-context";


interface WorkloadDistributionChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const WorkloadDistributionChartInternal = ({ data: allData, isModal = false }: WorkloadDistributionChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) return [];
    const analystCounts = allData.reduce((acc, ensayo) => {
        if (ensayo.analista) {
            acc[ensayo.analista] = (acc[ensayo.analista] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(analystCounts)
        .map(([name, value]) => ({
            name: name,
            shortName: name.split(' ')[0], // Show only first name for the axis
            value
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);

  const height = isModal ? 500 : 250;

  return (
    <div className="h-[250px] w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
              <defs>
                  <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1}/>
                  </linearGradient>
              </defs>
              <XAxis dataKey="shortName" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
              />
              <Bar dataKey="value" name="Ensayos" fill="url(#colorWorkload)" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="var(--chart-2)" />} />
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
