"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Received", value: 125, fill: "var(--color-received)"},
  { name: "In Progress", value: 89, fill: "var(--color-in-progress)" },
  { name: "Analysis", value: 62, fill: "var(--color-analysis)" },
  { name: "Review", value: 45, fill: "var(--color-review)" },
  { name: "Completed", value: 210, fill: "var(--color-completed)" },
  { name: "Archived", value: 54, fill: "var(--color-archived)" },
]

export function SampleStatusChart() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Sample Status Overview</CardTitle>
            <CardDescription>Current distribution of samples across workflow stages.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
