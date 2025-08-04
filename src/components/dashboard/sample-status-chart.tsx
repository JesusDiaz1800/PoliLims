
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const statusOrder = ["Aprobado", "En Progreso", "En Análisis", "Pendiente de Revisión", "Rechazado"];
const statusMapping: { [key: string]: string } = {
  "Aprobado": "Aprobado",
  "En Progreso": "En Progreso",
  "En Análisis": "En Análisis",
  "Pendiente de Revisión": "Pendiente de Revisión",
  "Rechazado": "Rechazado",
};

export function SampleStatusChart({ data }: SampleStatusChartProps) {
  const chartData = React.useMemo(() => {
    const statusCounts = statusOrder.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<string, number>);

    data.forEach(ensayo => {
        const mappedStatus = statusMapping[ensayo.estado] || "Otro";
        if (statusCounts.hasOwnProperty(mappedStatus)) {
            statusCounts[mappedStatus]++;
        }
    });

    return statusOrder.map((name, index) => ({
      name,
      value: statusCounts[name],
      fill: `hsl(var(--chart-${(index % 5) + 1}))`
    })).filter(d => d.value > 0);
  }, [data]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Análisis de Ensayos por Estado</CardTitle>
            <CardDescription>Distribución porcentual de los ensayos según su estado actual.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={150}>
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
                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                        ))}
                    </Pie>
                    <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        payload={chartData.map(item => ({
                            id: item.name,
                            type: "square",
                            value: `${item.name} (${item.value})`,
                            color: item.fill
                        }))}
                        wrapperStyle={{
                            fontSize: '14px',
                            lineHeight: '24px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}

    