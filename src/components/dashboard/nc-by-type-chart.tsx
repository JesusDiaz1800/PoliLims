
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip, Sector } from "recharts"
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
      { name: "Interna", value: typeCounts["Interna"] || 0, color: "hsl(var(--chart-1))" },
      { name: "Reclamo Cliente", value: typeCounts["Reclamo de Cliente"] || 0, color: "hsl(var(--chart-2))" },
      { name: "Auditoría", value: typeCounts["Auditoría"] || 0, color: "hsl(var(--chart-3))" },
    ].filter(item => item.value > 0);
  }, [data]);
  
  const height = isModal ? 500 : 250;
  const totalNC = React.useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (!percent || percent < 0.05) return null; // Don't render label for very small slices
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <div className="h-[250px] w-full relative" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <PieChart>
              <defs>
                  <linearGradient id="colorNc1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorNc2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorNc3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
                  </linearGradient>
              </defs>
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))'
                  }}
              />
              <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={isModal ? 150 : 80}
                  innerRadius={isModal ? 90 : 50}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={2}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorNc${index + 1})`} stroke={entry.color} />
                  ))}
              </Pie>
              <Legend 
                verticalAlign="bottom"
                wrapperStyle={{ bottom: isModal ? 20 : 0 }}
                formatter={(value) => <span className="text-white">{value}</span>}
              />
          </PieChart>
      </ResponsiveContainer>
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
              <p className="text-2xl font-bold font-headline">{totalNC}</p>
              <p className="text-xs text-muted-foreground -mt-1">Total NCs</p>
          </div>
      </div>
    </div>
  )
}
export const NonConformitiesByTypeChart = React.memo(NonConformitiesByTypeChartInternal);
