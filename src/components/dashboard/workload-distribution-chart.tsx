
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";
import type { Ensayo } from "@/context/data-context";

interface WorkloadDistributionChartProps {
    filters: DashboardFilters;
    data: Ensayo[];
}

export function WorkloadDistributionChart({ filters, data: allData }: WorkloadDistributionChartProps) {
  const chartData = React.useMemo(() => {
    const analystCounts = allData.reduce((acc, ensayo) => {
        acc[ensayo.analista] = (acc[ensayo.analista] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(analystCounts)
        .map(([name, value], index) => ({
            name,
            value,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }))
        .sort((a, b) => b.value - a.value);
  }, [allData, filters]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Carga de Trabajo</CardTitle>
        <CardDescription>Muestras asignadas por analista.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                  cursor={{fill: 'hsla(var(--accent), 0.3)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))'
                  }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                    if (!name) return '';
                    const shortNameParts = name.split(' ');
                    const shortName = shortNameParts.length > 1 
                        ? `${shortNameParts[0]} ${shortNameParts[1][0]}.` 
                        : shortNameParts[0];
                    return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
           <div className="flex items-center justify-center h-[300px]">
             <p className="text-sm text-muted-foreground text-center">No hay datos de carga de trabajo para mostrar.</p>
           </div>
        )}
      </CardContent>
    </Card>
  )
}
