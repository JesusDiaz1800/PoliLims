
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const initialData = [
  { name: "Ene", total: 186, fill: "hsl(var(--chart-1))" },
  { name: "Feb", total: 205, fill: "hsl(var(--chart-1))" },
  { name: "Mar", total: 237, fill: "hsl(var(--chart-2))" },
  { name: "Abr", total: 173, fill: "hsl(var(--chart-2))" },
  { name: "May", total: 209, fill: "hsl(var(--chart-3))" },
  { name: "Jun", total: 214, fill: "hsl(var(--chart-3))" },
  { name: "Jul", total: 268, fill: "hsl(var(--chart-4))" },
  { name: "Ago", total: 195, fill: "hsl(var(--chart-4))" },
  { name: "Sep", total: 223, fill: "hsl(var(--chart-5))" },
  { name: "Oct", total: 250, fill: "hsl(var(--chart-5))" },
  { name: "Nov", total: 210, fill: "hsl(var(--muted))" },
  { name: "Dic", total: 180, fill: "hsl(var(--muted))" },
]

interface AssaysByMonthChartProps {
    filters: DashboardFilters;
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};

export function AssaysByMonthChart({ filters }: AssaysByMonthChartProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    // Simulate filtering data
    const newData = initialData.map(item => ({
      ...item,
      total: Math.round(item.total * (Math.random() * 0.4 + 0.8)) // Randomize between 80% and 120%
    }));
    setData(newData);
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Ensayos por Mes</CardTitle>
        <CardDescription>Volumen de ensayos completados mensualmente durante el último año.</CardDescription>
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
                <Bar dataKey="total" name="Ensayos" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
