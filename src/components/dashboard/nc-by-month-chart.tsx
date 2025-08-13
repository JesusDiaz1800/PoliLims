
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { NoConformidad } from "@/context/data-context";
import { format, subMonths, getMonth, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface NonConformitiesByMonthChartProps {
    data: NoConformidad[];
}

const NonConformitiesByMonthChartInternal = ({ data: allData }: NonConformitiesByMonthChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) return [];
    
    const now = new Date();
    const monthlyData: { [key: string]: { total: number; name: string } } = {};

    for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthName = format(d, 'MMM', { locale: es });
        monthlyData[getMonth(d)] = {
            total: 0,
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1)
        };
    }

    allData.forEach(nc => {
        try {
            const ncDate = parseISO(nc.fecha_deteccion.split('-').reverse().join('-'));
            const month = getMonth(ncDate);
            if (monthlyData[month]) {
                monthlyData[month].total++;
            }
        } catch (e) {
            console.warn(`Invalid date format for NC ${nc.id}: ${nc.fecha_deteccion}`);
        }
    });
    
    return Object.values(monthlyData);
  }, [allData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>No Conformidades por Mes</CardTitle>
        <CardDescription>Volumen de NCs en los últimos 6 meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="total" name="No Conformidades" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
export const NonConformitiesByMonthChart = React.memo(NonConformitiesByMonthChartInternal);
