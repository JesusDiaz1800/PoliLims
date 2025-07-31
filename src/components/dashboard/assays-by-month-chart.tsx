
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";
import type { Ensayo } from "@/context/data-context";
import { format, subMonths, getMonth } from "date-fns";

interface AssaysByMonthChartProps {
    filters: DashboardFilters;
    data: Ensayo[];
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function AssaysByMonthChart({ filters, data: allData }: AssaysByMonthChartProps) {
  const chartData = React.useMemo(() => {
    const now = new Date();
    const monthlyData: { [key: string]: number } = {};

    // Initialize months
    for (let i = 0; i < 12; i++) {
        const monthName = monthNames[i];
        monthlyData[monthName] = 0;
    }

    allData.forEach(ensayo => {
        const ensayoDate = new Date(ensayo.fecha);
        const monthIndex = getMonth(ensayoDate);
        const monthName = monthNames[monthIndex];
        monthlyData[monthName]++;
    });
    
    return monthNames.map((name, index) => ({
        name,
        total: monthlyData[name],
        fill: `hsl(var(--chart-${(index % 5) + 1}))`
    }));

  }, [allData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Ensayos por Mes</CardTitle>
        <CardDescription>Volumen de ensayos completados mensualmente durante el último año.</CardDescription>
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
                <Bar dataKey="total" name="Ensayos" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
