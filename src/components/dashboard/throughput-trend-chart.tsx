
"use client"

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import type { Ensayo } from "@/context/data-context";
import { format, subDays, eachDayOfInterval, parse, parseISO } from "date-fns";


interface ThroughputTrendChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const ThroughputTrendChartInternal = ({ data: allData, isModal = false }: ThroughputTrendChartProps) => {
  const chartData = React.useMemo(() => {
    const now = new Date();
    const interval = eachDayOfInterval({
        start: subDays(now, 29),
        end: now
    });

    return interval.map(day => {
        const formattedDayKey = format(day, "yyyy-MM-dd");
        const formattedDayLabel = format(day, "dd/MM");
        
        const received = allData.filter(e => {
            try {
                return format(parse(e.fecha_ingreso || e.fecha, 'dd-MM-yyyy', new Date()), "yyyy-MM-dd") === formattedDayKey
            } catch { return false }
        }).length;

        const completed = allData.filter(e => {
            try {
                return e.estado === 'Aprobado' && format(parse(e.fecha, 'dd-MM-yyyy', new Date()), "yyyy-MM-dd") === formattedDayKey
            } catch { return false }
        }).length;
        
        return { day: formattedDayLabel, received, completed };
    });
  }, [allData]);

  const height = isModal ? 500 : 250;

  return (
    <div className="h-[250px] w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card) / 0.8)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid hsl(var(--border) / 0.3)',
                        borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend 
                    verticalAlign="bottom" 
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => <span className="text-white">{value}</span>}
                />
                <Line type="monotone" dataKey="received" name="Recibidas" stroke="hsl(var(--chart-4))" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="completed" name="Completadas" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
export const ThroughputTrendChart = React.memo(ThroughputTrendChartInternal);
