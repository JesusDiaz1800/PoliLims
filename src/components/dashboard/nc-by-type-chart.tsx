

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
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Origen de No Conformidades</CardTitle>
        <CardDescription>Distribución de NC según su origen.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={50}
              paddingAngle={5}
              dataKey="value"
               label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
             <Legend 
                iconSize={10} 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingBottom: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
export const NonConformitiesByTypeChart = React.memo(NonConformitiesByTypeChartInternal);

    
