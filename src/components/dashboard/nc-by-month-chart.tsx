
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { NoConformidad } from "@/context/data-context";
import { format, subMonths, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface NonConformitiesByMonthChartProps {
    data: NoConformidad[];
}

const NonConformitiesByMonthChartInternal = ({ data: allData }: NonConformitiesByMonthChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) return [];
    
    const now = new Date();
    const monthlyData: { [key: string]: { total: number; name: string; fill: string } } = {};

    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthKey = format(d, 'yyyy-MM');
        const monthLabel = format(d, 'MMM yy', { locale: es });
        monthlyData[monthKey] = {
            total: 0,
            name: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
            fill: `hsl(var(--chart-${((11 - i) % 5) + 1}))`
        };
    }

    allData.forEach(nc => {
        try {
            const ncDate = parseISO(nc.fecha_deteccion.split('-').reverse().join('-'));
            const monthKey = format(ncDate, 'yyyy-MM');
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].total++;
            }
        } catch (e) {
            console.warn(`Invalid date format for NC ${nc.id}: ${nc.fecha_deteccion}`);
        }
    });
    
    return Object.values(monthlyData);
  }, [allData]);

  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">No Conformidades por Mes</CardTitle>
        <CardDescription className="text-xs">Volumen de NCs registradas en los últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-full pb-2">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                    cursor={{ fill: 'hsla(var(--accent), 0.3)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                />
                <Bar dataKey="total" name="No Conformidades" radius={[2, 2, 0, 0]} fill="hsl(var(--chart-5))"/>
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const NonConformitiesByMonthChart = React.memo(NonConformitiesByMonthChartInternal);
