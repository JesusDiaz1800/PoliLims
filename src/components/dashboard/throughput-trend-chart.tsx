
"use client"

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const initialData = [
  { day: "01/07", completed: 3, received: 5 },
  { day: "03/07", completed: 4, received: 6 },
  { day: "06/07", completed: 2, received: 4 },
  { day: "09/07", completed: 5, received: 7 },
  { day: "12/07", completed: 6, received: 8 },
  { day: "15/07", completed: 4, received: 5 },
  { day: "18/07", completed: 7, received: 9 },
  { day: "21/07", completed: 5, received: 7 },
  { day: "24/07", completed: 8, received: 10 },
  { day: "27/07", completed: 6, received: 7 },
];

interface ThroughputTrendChartProps {
    filters: DashboardFilters;
}

export function ThroughputTrendChart({ filters }: ThroughputTrendChartProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    // Simulate filtering data
    const newData = initialData.map(item => ({
      ...item,
      completed: Math.round(item.completed * (Math.random() * 0.4 + 0.8)),
      received: Math.round(item.received * (Math.random() * 0.4 + 0.8)),
    }));
    setData(newData);
  }, [filters]);


  return (
    <Card>
        <CardHeader>
            <CardTitle>Tendencia de Rendimiento</CardTitle>
            <CardDescription>Muestras recibidas vs. completadas en los últimos 30 días.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{fill: 'hsla(var(--accent), 0.3)'}}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Legend iconSize={12} wrapperStyle={{fontSize: '14px', paddingTop: '10px'}}/>
                    <Line type="monotone" dataKey="received" name="Recibidas" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--chart-1))"}} />
                    <Line type="monotone" dataKey="completed" name="Completadas" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--chart-2))"}}/>
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
