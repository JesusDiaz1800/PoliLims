"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import type { Ensayo } from "@/context/data-context";
import { cn } from "@/lib/utils";

interface SampleStatusChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const SampleStatusChartInternal = ({ data, isModal = false }: SampleStatusChartProps) => {
  const chartData = React.useMemo(() => {
    const statusCounts = {
      Aprobado: 0,
      Pendiente: 0,
      Rechazado: 0,
    };

    data.forEach(ensayo => {
        if (ensayo.estado === "Aprobado") {
            statusCounts.Aprobado++;
        } else if (ensayo.estado === "Rechazado") {
            statusCounts.Rechazado++;
        } else if (pendingStatuses.includes(ensayo.estado)) {
            statusCounts.Pendiente++;
        }
    });
    
    return [
      { name: "Aprobado", value: statusCounts.Aprobado, color: "url(#colorStatusGreen)" },
      { name: "Pendiente", value: statusCounts.Pendiente, color: "url(#colorStatusYellow)" },
      { name: "Rechazado", value: statusCounts.Rechazado, color: "url(#colorStatusRed)" },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);
  const height = isModal ? 500 : 240;

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
    <div className="h-[240px] w-full relative" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <PieChart>
               <defs>
               <linearGradient id="colorStatusGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorStatusYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorStatusRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.7}/>
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
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={isModal ? 150 : 80}
                  innerRadius={isModal ? 90: 50}
                  dataKey="value"
                  paddingAngle={5}
                  strokeWidth={2}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color.replace('url(','').replace(')','')} />
                  ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                wrapperStyle={{ bottom: isModal ? 20 : -5, fontSize: '12px' }}
                formatter={(value, entry) => (
                    <span className="text-white">{value}: {entry.payload?.value}</span>
                )}
              />
          </PieChart>
      </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -translate-y-6">
           <p className="text-2xl font-bold font-headline">{total}</p>
           <p className="text-xs text-muted-foreground -mt-1">Total Ensayos</p>
       </div>
    </div>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
