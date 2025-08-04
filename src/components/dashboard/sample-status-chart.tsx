
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const statusOrder = ["Aprobado", "Pendiente", "Rechazado"];

export function SampleStatusChart({ data }: SampleStatusChartProps) {
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
    <Card>
        <CardHeader>
            <CardTitle>Análisis de Ensayos por Estado</CardTitle>
            <CardDescription>Distribución porcentual de los ensayos según su estado actual.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex items-center gap-4">
                 <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={150}>
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
                                outerRadius={60}
                                innerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                <span className="text-sm text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-semibold text-sm">{item.value}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-sm font-semibold text-muted-foreground">Total</span>
                        <span className="font-bold">{total}</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}
