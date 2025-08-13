
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Rectangle, LabelList } from "recharts"
import type { Ensayo } from "@/context/data-context";


interface AssaysByTypeChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const AssaysByTypeChartInternal = ({ data: allData, isModal = false }: AssaysByTypeChartProps) => {
    const chartData = React.useMemo(() => {
        const typeCounts = allData.reduce((acc, ensayo) => {
            acc[ensayo.tipo] = (acc[ensayo.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(typeCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allData]);

    const height = isModal ? 500 : 250;
    
    return (
    <div className="h-[250px] w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                  <linearGradient id="colorType1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorType2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorType3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorType4" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2}/>
                  </linearGradient>
                   <linearGradient id="colorType5" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.2}/>
                  </linearGradient>
              </defs>
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} stroke="#888888" tickLine={false} axisLine={false} interval={0} />
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value" name="Ensayos" radius={[0, 4, 4, 0]} activeBar={<Rectangle fillOpacity={0.8} />}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorType${(index % 5) + 1})`} />
                  ))}
                  <LabelList dataKey="value" position="right" fill="hsl(var(--foreground))" fontSize={12} />
              </Bar>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const AssaysByTypeChart = React.memo(AssaysByTypeChartInternal);
