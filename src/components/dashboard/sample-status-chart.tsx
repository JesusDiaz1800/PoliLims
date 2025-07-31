
"use client"

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";

interface SampleStatusChartProps {
    data: Ensayo[];
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};

const statusOrder = ["Recibidas", "En Progreso", "En Análisis", "En Revisión", "Completadas", "Archivadas"];
const statusMapping: { [key: string]: string } = {
  "Pendiente de Revisión": "En Revisión",
  "Aprobado": "Completadas",
  "Rechazado": "Completadas",
  "En Progreso": "En Progreso",
};


export function SampleStatusChart({ data }: SampleStatusChartProps) {
  const chartData = React.useMemo(() => {
    const statusCounts = statusOrder.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<string, number>);

    data.forEach(ensayo => {
        const mappedStatus = statusMapping[ensayo.estado] || "Recibidas";
        if (statusCounts.hasOwnProperty(mappedStatus)) {
            statusCounts[mappedStatus]++;
        }
    });

    return statusOrder.map((name, index) => ({
      name,
      value: statusCounts[name],
      fill: `hsl(var(--chart-${(index % 5) + 1}))`
    }));
  }, [data]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Estado General de Muestras</CardTitle>
            <CardDescription>Distribución actual de las muestras en las etapas del flujo de trabajo.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                        cursor={<CustomCursor />}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Bar dataKey="value" name="Muestras" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
