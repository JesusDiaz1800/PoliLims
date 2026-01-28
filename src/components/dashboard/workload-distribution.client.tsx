"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface WorkloadDistributionChartProps {
  data: any[];
}

export function WorkloadDistributionChart({ data }: WorkloadDistributionChartProps) {
  const chartData = React.useMemo(() => {
    const analystCounts: { [key: string]: number } = {};
    (data || []).forEach(item => {
      const analyst = item?.analista || 'Sin Analista';
      analystCounts[analyst] = (analystCounts[analyst] || 0) + 1;
    });

    const getShortName = (full: string) => {
      const safe = (full || '').trim();
      if (!safe) return 'Sin analista';
      const parts = safe.split(/\s+/);
      return parts[0];
    };

    return Object.entries(analystCounts)
      .map(([analyst, value]) => ({ analyst, label: getShortName(analyst), value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 10, bottom: 4, left: 0 }}
        barCategoryGap={8}
      >
        <defs>
          <linearGradient id="workloadBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border) / 0.25)" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis dataKey="label" type="category" width={72} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)"
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number) => [value, 'Ensayos']}
        />
        <Bar dataKey="value" name="Ensayos" radius={[0, 10, 10, 0]} fill="url(#workloadBar)" stroke="#0ea5e9" strokeOpacity={0.35}>
          <LabelList dataKey="value" position="right" fill="hsl(var(--foreground))" fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}


