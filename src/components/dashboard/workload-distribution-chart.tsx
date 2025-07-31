
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const initialData = [
  { name: "Jesus Diaz", value: 45, color: "hsl(var(--chart-1))", id: "jesus.diaz" },
  { name: "Maximiliano Miranda", value: 32, color: "hsl(var(--chart-2))", id: "maximiliano.miranda" },
  { name: "Antonia Figueroa", value: 28, color: "hsl(var(--chart-3))", id: "antonia.figueroa" },
  { name: "Robinson Córdova", value: 22, color: "hsl(var(--chart-4))", id: "robinson.cordova" },
  { name: "Bryan Vásquez", value: 18, color: "hsl(var(--chart-5))", id: "bryan.vasquez" },
]

interface WorkloadDistributionChartProps {
    filters: DashboardFilters;
}


export function WorkloadDistributionChart({ filters }: WorkloadDistributionChartProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    let filteredData = initialData;
    if (filters.analyst !== 'all') {
      filteredData = initialData.filter(item => item.id === filters.analyst);
    }
    
    const newData = filteredData.map(item => ({
      ...item,
      value: Math.round(item.value * (Math.random() * 0.4 + 0.8))
    }));
    
    setData(newData);

  }, [filters]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Carga de Trabajo</CardTitle>
        <CardDescription>Muestras asignadas por analista.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
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
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                    const shortName = name.split(' ')[0] + (name.split(' ').length > 1 ? ` ${name.split(' ')[1][0]}.` : '');
                    return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
           <div className="flex items-center justify-center h-[300px]">
             <p className="text-sm text-muted-foreground text-center">No hay datos de carga de trabajo para el analista seleccionado.</p>
           </div>
        )}
      </CardContent>
    </Card>
  )
}
