
"use client"

import * as React from "react"
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

const COLORS = {
    Aprobado: "hsl(var(--chart-2))",
    Pendiente: "hsl(var(--chart-3))",
    Rechazado: "hsl(var(--chart-4))",
};

const getBadgeVariant = (status: keyof typeof COLORS) => {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "Pendiente": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
    }
}


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

    return statusOrder.map(status => ({
        name: status,
        value: statusCounts[status as keyof typeof statusCounts],
    })).filter(d => d.value > 0);
  }, [data]);
  
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <>
      <CardHeader>
        <CardTitle>Estado de Muestras</CardTitle>
        <CardDescription>Distribución porcentual de ensayos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} stroke={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                         <Label
                            value={`${total} Muestras`}
                            position="center"
                            fill="hsl(var(--muted-foreground))"
                            className="text-sm font-medium"
                         />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-2 text-xs mt-4">
            {chartData.map(item => (
                <Badge key={item.name} className={cn("border-transparent font-normal", getBadgeVariant(item.name as keyof typeof COLORS))}>
                    {item.name}: {item.value} ({(item.value / total * 100).toFixed(1)}%)
                </Badge>
            ))}
        </div>
      </CardContent>
    </>
  )
}
export const SampleStatusChart = React.memo(SampleStatusChartInternal);
