
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
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
          <defs>
              <linearGradient id="colorByType" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.8}/>
              </linearGradient>
          </defs>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} stroke="#888888" tickLine={false} axisLine={false} />
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
              />
              <Bar dataKey="value" name="Cantidad" fill="url(#colorByType)" radius={[0, 4, 4, 0]} activeBar={<Rectangle fill="var(--chart-3)" />} />
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const AssaysByTypeChart = React.memo(AssaysByTypeChartInternal);
