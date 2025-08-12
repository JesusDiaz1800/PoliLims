
"use client"

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";


interface ThroughputTrendChartProps {
    data: Ensayo[];
}

const ThroughputTrendChartInternal = ({ data: allData }: ThroughputTrendChartProps) => {
  const chartData = React.useMemo(() => {
    const now = new Date();
    const interval = eachDayOfInterval({
        start: subDays(now, 29),
        end: now
    });

    return interval.map(day => {
        const formattedDayKey = format(day, "yyyy-MM-dd");
        const formattedDayLabel = format(day, "dd/MM");
        
        const received = allData.filter(e => format(parseISO(e.fecha.split('-').reverse().join('-')), "yyyy-MM-dd") === formattedDayKey).length;
        const completed = allData.filter(e => e.estado === 'Aprobado' && format(parseISO(e.fecha.split('-').reverse().join('-')), "yyyy-MM-dd") === formattedDayKey).length;
        
        return { day: formattedDayLabel, received, completed };
    });
  }, [allData]);


  return (
    <Card>
        <CardHeader>
            <CardTitle>Tendencia de Rendimiento</CardTitle>
            <CardDescription>Muestras recibidas vs. completadas en los últimos 30 días.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={210}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
export const ThroughputTrendChart = React.memo(ThroughputTrendChartInternal);
    

    
