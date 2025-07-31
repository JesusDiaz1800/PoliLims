
"use client"

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const initialData = [
  { name: "Recibidas", value: 125, fill: "hsl(var(--chart-1))"},
  { name: "En Progreso", value: 89, fill: "hsl(var(--chart-2))" },
  { name: "En Análisis", value: 62, fill: "hsl(var(--chart-3))" },
  { name: "En Revisión", value: 45, fill: "hsl(var(--chart-4))" },
  { name: "Completadas", value: 210, fill: "hsl(var(--chart-5))" },
  { name: "Archivadas", value: 54, fill: "hsl(var(--muted))" },
]

interface SampleStatusChartProps {
    filters: DashboardFilters;
}

// Custom cursor component
const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};


export function SampleStatusChart({ filters }: SampleStatusChartProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    // Simulate filtering data
    const newData = initialData.map(item => ({
      ...item,
      value: Math.round(item.value * (Math.random() * 0.4 + 0.8)) // Randomize between 80% and 120%
    }));
    setData(newData);
  }, [filters]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Estado General de Muestras</CardTitle>
            <CardDescription>Distribución actual de las muestras en las etapas del flujo de trabajo.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
