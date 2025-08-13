

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
        { name: 'Aprobado', value: statusCounts.Aprobado, fill: 'hsl(var(--chart-2))' },
        { name: 'Pendiente', value: statusCounts.Pendiente, fill: 'hsl(var(--chart-3))' },
        { name: 'Rechazado', value: statusCounts.Rechazado, fill: 'hsl(var(--chart-5))' },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <>
        <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base">Estado de Ensayos</CardTitle>
            <CardDescription className="text-xs">Distribución porcentual de ensayos.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] pb-2">
             <div className="flex items-center gap-2 h-full">
                 <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={45}
                                innerRadius={30}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} stroke={entry.fill} />
                                ))}
                                <Label value={total} position="center" fill="hsl(var(--foreground))" className="text-lg font-bold font-headline"/>
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-1.5">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
    </>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
