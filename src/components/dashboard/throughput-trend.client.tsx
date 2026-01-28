"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ThroughputTrendChartProps {
  data: any[];
}

export function ThroughputTrendChart({ data }: ThroughputTrendChartProps) {
  const chartData = React.useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map((day, index) => {
      const dayData = (data || []).filter((item) => {
        const d = new Date(item.fecha);
        return d.getDay() === (index + 1) % 7;
      });
      return {
        day,
        recibidas: dayData.length,
        completadas: dayData.filter((item) => item.estado === 'Aprobado').length,
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            backdropFilter: "blur(8px)",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)"
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Line type="monotone" dataKey="recibidas" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: "#3B82F6", strokeWidth: 2 }} />
        <Line type="monotone" dataKey="completadas" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: "#10B981", strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}


