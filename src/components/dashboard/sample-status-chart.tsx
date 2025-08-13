
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Label, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

const statusOrder = ["Aprobado", "Pendiente", "Rechazado"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="font-bold text-foreground text-xs">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground">
            Cantidad: <span className="font-bold text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

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
        { name: 'Rechazado', value: statusCounts.Rechazado, fill: 'hsl(var(--chart-4))' },
    ].filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <>
        <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">Estado de Ensayos</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Distribución porcentual de ensayos.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] pb-2 flex flex-col items-center justify-center">
             <div className="w-full h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                         <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={<CustomTooltip />}
                        />
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={55}
                            innerRadius={40}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                if (percent === 0) return null;
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs mt-2">
                {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold">{item.value}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
