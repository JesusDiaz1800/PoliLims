
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilterParams } from "@/app/(app)/dashboard/page";
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Registros por Analista</CardTitle>
        <CardDescription>Número de ensayos registrados por analista en el período seleccionado.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    dy={10}
                 />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={<CustomCursor />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))'
                    }}
                />
                <Bar dataKey="value" name="Ensayos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
           <div className="flex items-center justify-center h-full">
             <p className="text-sm text-muted-foreground text-center">No hay datos de carga de trabajo para mostrar con los filtros actuales.</p>
           </div>
        )}
      </CardContent>
    </Card>
  )
}
export const WorkloadDistributionChart = React.memo(WorkloadDistributionChartInternal);
    

    