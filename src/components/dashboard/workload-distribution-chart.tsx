
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";


interface WorkloadDistributionChartProps {
    data: Ensayo[];
}

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return <Rectangle fill="hsla(var(--accent), 0.3)" x={x} y={y} width={width} height={height} />;
};


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
        .map(([name, value], index) => ({
            name: name.split(' ')[0], // Show only first name
            value,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);


  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Carga de Trabajo</CardTitle>
        <CardDescription className="text-sm">Ensayos por analista en el período.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] pb-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={40}
                 />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
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
                <Bar dataKey="value" name="Ensayos" radius={[2, 2, 0, 0]} barSize={12}/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
           <div className="flex items-center justify-center h-full">
             <p className="text-xs text-muted-foreground text-center">No hay datos de carga de trabajo para mostrar con los filtros actuales.</p>
           </div>
        )}
      </CardContent>
    </>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
