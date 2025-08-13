
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { format, subMonths, getMonth, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface AssaysByMonthChartProps {
    data: Ensayo[];
}

const AssaysByMonthChartInternal = ({ data: allData }: AssaysByMonthChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) {
        return [];
    }
    const now = new Date();
    const monthlyData: { [key: string]: { total: number; name: string } } = {};

    // Initialize months
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthName = format(d, 'MMM', { locale: es });
        monthlyData[getMonth(d)] = {
            total: 0,
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1)
        };
    }

    allData.forEach(ensayo => {
        try {
            const ensayoDate = parseISO(ensayo.fecha.split('-').reverse().join('-'));
            const month = getMonth(ensayoDate);
            if (monthlyData[month]) {
                monthlyData[month].total++;
            }
        } catch (e) {
            console.warn(`Invalid date format for ensayo ${ensayo.id}: ${ensayo.fecha}`);
        }
    });

    return Object.values(monthlyData);
  }, [allData]);

  return (
    <>
      <CardHeader>
        <CardTitle>Ensayos por Mes</CardTitle>
        <CardDescription>Volumen total de ensayos en los últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="total" name="Ensayos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="hsl(var(--primary) / 0.8)" />} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssaysByMonthChart = React.memo(AssaysByMonthChartInternal);
