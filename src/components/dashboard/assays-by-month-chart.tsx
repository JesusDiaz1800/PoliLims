
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

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};


export function AssaysByMonthChart({ data: allData }: AssaysByMonthChartProps) {
  const chartData = React.useMemo(() => {
    const now = new Date();
    const monthlyData: { [key: string]: number } = {};
    const monthLabels: string[] = [];

    // Initialize months for the last 12 months
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthKey = format(d, 'yyyy-MM');
        const monthLabel = format(d, 'MMM yy', { locale: es });
        monthlyData[monthKey] = 0;
        if (!monthLabels.includes(monthLabel)) {
           monthLabels.push(monthLabel);
        }
    }

    allData.forEach(ensayo => {
        try {
            const ensayoDate = parseISO(ensayo.fecha.split('-').reverse().join('-'));
            const monthKey = format(ensayoDate, 'yyyy-MM');
            if (monthlyData.hasOwnProperty(monthKey)) {
                monthlyData[monthKey]++;
            }
        } catch (e) {
            console.warn(`Invalid date format for ensayo ${ensayo.id}: ${ensayo.fecha}`);
        }
    });
    
    return monthLabels.map((label, index) => {
        const [monthName, year] = label.split(' ');
        const d = new Date(`${monthName} 1, ${'20' + year}`);
        const monthKey = format(d, 'yyyy-MM');
        
        return {
            name: label.charAt(0).toUpperCase() + label.slice(1),
            total: monthlyData[monthKey] || 0,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        };
    });

  }, [allData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Ensayos por Mes</CardTitle>
        <CardDescription>Volumen de ensayos registrados mensualmente durante los últimos 12 meses.</CardDescription>
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
