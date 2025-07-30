
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Activos", value: 18, color: "hsl(var(--chart-1))" },
  { name: "Mantenimiento", value: 2, color: "hsl(var(--chart-3))" },
  { name: "Inactivos", value: 2, color: "hsl(var(--muted))" },
]

export function EquipmentStatusChart() {
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
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
             <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
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
