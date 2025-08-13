
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";


interface WorkloadDistributionChartProps {
    data: Ensayo[];
}

const WorkloadDistributionChartInternal = ({ data: allData }: WorkloadDistributionChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) return [];
    const analystCounts = allData.reduce((acc, ensayo) => {
        if (ensayo.analista) {
            acc[ensayo.analista] = (acc[ensayo.analista] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(analystCounts)
        .map(([name, value]) => ({
            name: name,
            shortName: name.split(' ')[0], // Show only first name for the axis
            value
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);


  return (
    <>
      <CardHeader>
        <CardTitle>Distribución de Carga de Trabajo</CardTitle>
        <CardDescription>Cantidad de ensayos por analista.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey="shortName" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="value" name="Ensayos" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="hsl(var(--chart-2) / 0.8)" />} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
