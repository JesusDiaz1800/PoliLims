

"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Equipo } from "@/context/data-context";

interface EquipmentStatusChartProps {
  data: Equipo[];
}

export function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
  const chartData = React.useMemo(() => {
    const statusCounts = data.reduce((acc, equipo) => {
      acc[equipo.estado] = (acc[equipo.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Activo", value: statusCounts["Activo"] || 0, color: "hsl(var(--chart-1))" },
      { name: "Mantenimiento", value: statusCounts["En Mantenimiento"] || 0, color: "hsl(var(--chart-3))" },
      { name: "Requiere Calibración", value: statusCounts["Requiere Calibración"] || 0, color: "hsl(var(--chart-4))" },
      { name: "Inactivo", value: statusCounts["Inactivo"] || 0, color: "hsl(var(--muted))" },
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado General de Equipos</CardTitle>
        <CardDescription>Distribución de equipos por estado operativo.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
             <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                payload={chartData.map(item => ({
                    id: item.name,
                    type: "square",
                    value: `${item.name} (${item.value})`,
                    color: item.color
                }))}
                wrapperStyle={{
                    fontSize: '14px',
                    lineHeight: '24px'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

    
