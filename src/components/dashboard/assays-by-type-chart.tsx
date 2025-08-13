

"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";


interface AssaysByTypeChartProps {
    data: Ensayo[];
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
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
        <CardTitle className="text-base">Ensayos por Tipo</CardTitle>
        <CardDescription className="text-xs">Distribución de la cantidad de ensayos.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pb-2">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
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
                <Bar dataKey="value" name="Cantidad" radius={[0, 2, 2, 0]} barSize={12}/>
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssaysByTypeChart = React.memo(AssaysByTypeChartInternal);
