
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip, Sector } from "recharts"
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
        .map(([name, value], index) => ({
            name: name,
            value,
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);

  const height = isModal ? 500 : 250;
  const totalAnalysts = chartData.length;
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (!percent || percent < 0.05) return null;
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
                <linearGradient id="colorAnalyst1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/></linearGradient>
                <linearGradient id="colorAnalyst2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/></linearGradient>
                <linearGradient id="colorAnalyst3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/></linearGradient>
                <linearGradient id="colorAnalyst4" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2}/></linearGradient>
                <linearGradient id="colorAnalyst5" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.2}/></linearGradient>
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
                  label={renderCustomizedLabel}
                  outerRadius={isModal ? 150 : 80}
                  innerRadius={isModal ? 90 : 50}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={2}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorAnalyst${(index % 5) + 1})`} stroke={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
              </Pie>
              <Legend 
                verticalAlign="bottom"
                wrapperStyle={{ bottom: isModal ? 20 : 0 }}
              />
          </PieChart>
      </ResponsiveContainer>
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
              <p className="text-2xl font-bold font-headline">{totalAnalysts}</p>
              <p className="text-xs text-muted-foreground -mt-1">Analistas</p>
          </div>
      </div>
    </div>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
