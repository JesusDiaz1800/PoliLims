
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import type { Ensayo } from "@/context/data-context";

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
    
    const colors = ["hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

    return [
      { name: "Aprobado", value: statusCounts.Aprobado, color: colors[0] },
      { name: "Pendiente", value: statusCounts.Pendiente, color: colors[1] },
      { name: "Rechazado", value: statusCounts.Rechazado, color: colors[2] },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);
  const height = isModal ? 500 : 250;

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
                {chartData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorStatus${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={entry.color} stopOpacity={0.1}/>
                    </linearGradient>
                ))}
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
                  innerRadius={isModal ? 90: 50}
                  dataKey="value"
                  paddingAngle={5}
                  strokeWidth={2}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorStatus${index})`} stroke={entry.color} />
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
              <p className="text-2xl font-bold font-headline">{total}</p>
              <p className="text-xs text-muted-foreground -mt-1">Total Muestras</p>
          </div>
      </div>
    </div>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
