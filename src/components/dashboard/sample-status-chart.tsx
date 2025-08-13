
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const SampleStatusChartInternal = ({ data }: SampleStatusChartProps) => {
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
      { name: "Aprobado", value: statusCounts.Aprobado, color: "hsl(var(--chart-2))" },
      { name: "Pendiente", value: statusCounts.Pendiente, color: "hsl(var(--chart-3))" },
      { name: "Rechazado", value: statusCounts.Rechazado, color: "hsl(var(--chart-4))" },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <>
      <CardHeader>
        <CardTitle>Estado de Muestras</CardTitle>
        <CardDescription>Distribución porcentual de ensayos.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                    }) => {
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
                    }}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                    ))}
                </Pie>
                 <Legend />
            </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
