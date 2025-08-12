

"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const statusOrder = ["Aprobado", "Pendiente", "Rechazado"];

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
        { name: 'Aprobado', value: statusCounts.Aprobado, fill: 'var(--color-chart-2)' },
        { name: 'Pendiente', value: statusCounts.Pendiente, fill: 'var(--color-chart-3)' },
        { name: 'Rechazado', value: statusCounts.Rechazado, fill: 'var(--color-chart-5)' },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <>
        <CardHeader>
            <CardTitle>Estado de Ensayos</CardTitle>
            <CardDescription>Distribución porcentual de ensayos.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] pb-0">
             <div className="flex items-center gap-2 h-full">
                 <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <style>
                                {
                                    `
                                    :root {
                                        --color-chart-1: hsl(var(--chart-1));
                                        --color-chart-2: hsl(var(--chart-2));
                                        --color-chart-3: hsl(var(--chart-3));
                                        --color-chart-4: hsl(var(--chart-4));
                                        --color-chart-5: hsl(var(--chart-5));
                                    }
                                    .dark {
                                        --color-chart-1: hsl(var(--chart-1));
                                        --color-chart-2: hsl(var(--chart-2));
                                        --color-chart-3: hsl(var(--chart-3));
                                        --color-chart-4: hsl(var(--chart-4));
                                        --color-chart-5: hsl(var(--chart-5));
                                    }
                                    `
                                }
                            </style>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={50}
                                innerRadius={30}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {chartData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} stroke={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between border-t pt-1 mt-1 text-xs">
                        <span className="font-semibold text-muted-foreground">Total</span>
                        <span className="font-bold">{total}</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
