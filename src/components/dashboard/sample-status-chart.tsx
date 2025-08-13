
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
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

    return [
      { name: "Aprobado", value: statusCounts.Aprobado, color: "var(--chart-2)" },
      { name: "Pendiente", value: statusCounts.Pendiente, color: "var(--chart-3)" },
      { name: "Rechazado", value: statusCounts.Rechazado, color: "var(--chart-4)" },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);
  const height = isModal ? 500 : 250;


  return (
    <div className="h-[250px] w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
                  innerRadius={isModal ? 90: 50}
                  dataKey="value"
                  paddingAngle={5}
                  label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      index,
                  }) => {
                      if(isModal) {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                            x={x}
                            y={y}
                            className="fill-muted-foreground text-xs"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            >
                            {chartData[index].name} ({(value / total * 100).toFixed(0)}%)
                            </text>
                        );
                      }
                      return null;
                  }}
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
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
