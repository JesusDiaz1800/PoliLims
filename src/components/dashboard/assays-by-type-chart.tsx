
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";


interface AssaysByTypeChartProps {
    data: Ensayo[];
}

const AssaysByTypeChartInternal = ({ data: allData }: AssaysByTypeChartProps) => {
    const chartData = React.useMemo(() => {
        const typeCounts = allData.reduce((acc, ensayo) => {
            acc[ensayo.tipo] = (acc[ensayo.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(typeCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allData]);

  return (
    <>
      <CardHeader>
        <CardTitle>Ensayos por Tipo</CardTitle>
        <CardDescription>Distribución de la cantidad de ensayos.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="value" name="Cantidad" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="hsl(var(--chart-3) / 0.8)" />} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssaysByTypeChart = React.memo(AssaysByTypeChartInternal);
