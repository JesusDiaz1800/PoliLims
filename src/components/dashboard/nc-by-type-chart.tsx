
"use client"

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { NoConformidad } from "@/context/data-context";

interface NonConformitiesByTypeChartProps {
  data: NoConformidad[];
}

const NonConformitiesByTypeChartInternal = ({ data }: NonConformitiesByTypeChartProps) => {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    const typeCounts = data.reduce((acc, nc) => {
      acc[nc.tipo] = (acc[nc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Interna", value: typeCounts["Interna"] || 0, color: "hsl(var(--chart-2))" },
      { name: "Reclamo Cliente", value: typeCounts["Reclamo de Cliente"] || 0, color: "hsl(var(--chart-5))" },
      { name: "Auditoría", value: typeCounts["Auditoría"] || 0, color: "hsl(var(--chart-3))" },
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <>
      <CardHeader>
        <CardTitle>Origen de NCs</CardTitle>
        <CardDescription>Distribución de NC según su origen.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
             <Legend 
                iconSize={8} 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingBottom: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const NonConformitiesByTypeChart = React.memo(NonConformitiesByTypeChartInternal);
