
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, Cell } from "recharts"
import type { Ensayo } from "@/context/data-context";
import { format, subMonths, getMonth, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface AssaysByMonthChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const AssaysByMonthChartInternal = ({ data: allData, isModal = false }: AssaysByMonthChartProps) => {
  const chartData = React.useMemo(() => {
    if (!allData) {
        return [];
    }
    const now = new Date();
    const monthlyData: { [key: string]: { total: number; name: string } } = {};

    // Initialize months
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthName = format(d, 'MMM', { locale: es });
        monthlyData[getMonth(d)] = {
            total: 0,
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1)
        };
    }

    allData.forEach(ensayo => {
        try {
            const ensayoDate = parseISO(ensayo.fecha.split('-').reverse().join('-'));
            const month = getMonth(ensayoDate);
            if (monthlyData[month]) {
                monthlyData[month].total++;
            }
        } catch (e) {
            console.warn(`Invalid date format for ensayo ${ensayo.id}: ${ensayo.fecha}`);
        }
    });

    return Object.values(monthlyData);
  }, [allData]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                  cursor={{fill: 'hsla(var(--primary), 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                      borderRadius: 'var(--radius)',
                  }}
              />
              <Bar dataKey="total" name="Ensayos" radius={[4, 4, 0, 0]} activeBar={<Rectangle fillOpacity={0.8} />}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
              </Bar>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const AssaysByMonthChart = React.memo(AssaysByMonthChartInternal);
