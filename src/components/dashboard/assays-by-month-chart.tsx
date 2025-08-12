

"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { format, subMonths, getMonth, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface AssaysByMonthChartProps {
    data: Ensayo[];
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};


const AssaysByMonthChartInternal = ({ data: allData }: AssaysByMonthChartProps) => {
  const {chartData, average} = React.useMemo(() => {
    if (!allData) {
        return { chartData: [], average: 0 };
    }
    const now = new Date();
    const monthlyData: { [key: string]: { total: number; name: string; fill: string } } = {};

    // Initialize months for the last 12 months
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

    allData.forEach(ensayo => {
        try {
            const ensayoDate = parseISO(ensayo.fecha.split('-').reverse().join('-'));
            const monthKey = format(ensayoDate, 'yyyy-MM');
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].total++;
            }
        } catch (e) {
            console.warn(`Invalid date format for ensayo ${ensayo.id}: ${ensayo.fecha}`);
        }
    });
    
    const dataPoints = Object.values(monthlyData);
    const totalAssays = dataPoints.reduce((sum, item) => sum + item.total, 0);
    const avg = totalAssays > 0 ? totalAssays / dataPoints.length : 0;
    
    return { chartData: dataPoints, average: avg };

  }, [allData]);

  return (
    <>
      <CardHeader>
        <CardTitle>Ensayos por Mes</CardTitle>
        <CardDescription>Volumen de ensayos en los últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pb-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                    cursor={<CustomCursor />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                />
                <Bar dataKey="total" name="Ensayos" radius={[2, 2, 0, 0]} />
                <ReferenceLine 
                    y={average} 
                    label={{ value: `Promedio: ${average.toFixed(1)}`, position: 'insideTopLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3" 
                />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssaysByMonthChart = React.memo(AssaysByMonthChartInternal);
