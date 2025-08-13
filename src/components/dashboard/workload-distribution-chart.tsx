"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, Cell } from "recharts"
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
            name: name.split(' ')[0], // Shorten name for display
            value,
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);

  const height = isModal ? 500 : 240;

  return (
    <div className="h-[240px] w-full relative" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
               <defs>
                  <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4}/>
                  </linearGradient>
              </defs>
              <XAxis dataKey="name" type="category" tick={{fontSize: 12}} stroke="#888888" tickLine={false} axisLine={false} />
              <YAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
              />
              <Bar dataKey="value" name="Registros" radius={[4, 4, 0, 0]} fill="url(#colorWorkload)" activeBar={<Rectangle fillOpacity={0.8} />}/>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
