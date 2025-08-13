
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="font-bold text-card-foreground text-base">{label}</p>
        <p className="text-xs text-muted-foreground">Ensayos: {payload[0].value}</p>
      </div>
    );
  }
  return null;
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
            name: name,
            shortName: name.split(' ')[0], // Show only first name for the axis
            value,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData]);


  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">Carga de Trabajo</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Ensayos por analista en el período.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] pb-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                    dataKey="shortName" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    interval={0}
                    height={30}
                 />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={<CustomCursor />}
                    content={<CustomTooltip />}
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
