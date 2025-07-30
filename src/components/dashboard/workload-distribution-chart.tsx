
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Jesus Diaz", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Maximiliano M.", value: 32, color: "hsl(var(--chart-2))" },
  { name: "Antonia Figueroa", value: 28, color: "hsl(var(--chart-3))" },
  { name: "Robinson Córdova", value: 22, color: "hsl(var(--chart-4))" },
  { name: "Bryan Vásquez", value: 18, color: "hsl(var(--chart-5))" },
]

export function WorkloadDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Carga de Trabajo</CardTitle>
        <CardDescription>Muestras asignadas por analista.</CardDescription>
      </CardHeader>
      <CardContent>
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
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
