
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const initialData = [
  { name: "Tubería HDPE", value: 112, fill: "hsl(var(--chart-1))" },
  { name: "Tubería PP", value: 98, fill: "hsl(var(--chart-2))" },
  { name: "Materia Prima", value: 75, fill: "hsl(var(--chart-3))" },
  { name: "Reprocesado", value: 45, fill: "hsl(var(--chart-4))" },
  { name: "Control Accesorios", value: 32, fill: "hsl(var(--chart-5))" },
  { name: "Control Agua", value: 21, fill: "hsl(var(--muted))" },
]

interface AssaysByTypeChartProps {
    filters: DashboardFilters;
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};

export function AssaysByTypeChart({ filters }: AssaysByTypeChartProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    // Simulate filtering data
    const newData = initialData.map(item => ({
      ...item,
      value: Math.round(item.value * (Math.random() * 0.4 + 0.8)) // Randomize between 80% and 120%
    }));
    setData(newData.sort((a,b) => b.value - a.value));
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ensayos por Tipo</CardTitle>
        <CardDescription>Distribución de la cantidad de ensayos según su tipo.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={<CustomCursor />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))'
                    }}
                />
                <Bar dataKey="value" name="Cantidad" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
