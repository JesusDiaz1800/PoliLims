
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import type { NoConformidad } from "@/context/data-context";

interface NonConformitiesByTypeChartProps {
  data: NoConformidad[];
  isModal?: boolean;
}

const NonConformitiesByTypeChartInternal = ({ data, isModal = false }: NonConformitiesByTypeChartProps) => {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    const typeCounts = data.reduce((acc, nc) => {
      acc[nc.tipo] = (acc[nc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Interna", value: typeCounts["Interna"] || 0, color: "var(--chart-2)" },
      { name: "Reclamo Cliente", value: typeCounts["Reclamo de Cliente"] || 0, color: "var(--chart-5)" },
      { name: "Auditoría", value: typeCounts["Auditoría"] || 0, color: "var(--chart-3)" },
    ].filter(item => item.value > 0);
  }, [data]);
  
  const height = isModal ? 500 : 250;

  return (
    <div className="h-[250px] w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <PieChart>
              <defs>
                  <linearGradient id="colorNc1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNc2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNc3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.1}/>
                  </linearGradient>
              </defs>
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
              />
              <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isModal ? 150 : 80}
                  dataKey="value"
                  strokeWidth={2}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
              </Pie>
              <Legend 
                  wrapperStyle={isModal ? { bottom: 20 } : {}}
              />
          </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
export const NonConformitiesByTypeChart = React.memo(NonConformitiesByTypeChartInternal);
