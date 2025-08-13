
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";


interface AssaysByTypeChartProps {
    data: Ensayo[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="font-bold text-card-foreground text-xs">{label}</p>
        <p className="text-xs text-muted-foreground">
            Cantidad: <span className="font-bold text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};


const AssaysByTypeChartInternal = ({ data: allData }: AssaysByTypeChartProps) => {
    const chartData = React.useMemo(() => {
        const typeCounts = allData.reduce((acc, ensayo) => {
            acc[ensayo.tipo] = (acc[ensayo.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(typeCounts)
            .map(([name, value], index) => ({
                name,
                value,
                fill: `hsl(var(--chart-${(index % 5) + 1}))`
            }))
            .sort((a, b) => b.value - a.value);
    }, [allData]);

  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Ensayos por Tipo</CardTitle>
        <CardDescription>Distribución de la cantidad de ensayos.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pb-2">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={false}
                    content={<CustomTooltip />}
                />
                <Bar dataKey="value" name="Cantidad" radius={[0, 2, 2, 0]} barSize={12}>
                    <LabelList 
                        dataKey="value" 
                        position="insideRight" 
                        offset={8}
                        className="fill-white font-bold"
                        fontSize={10}
                        formatter={(value: number) => (value > 0 ? value : '')}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssaysByTypeChart = React.memo(AssaysByTypeChartInternal);
