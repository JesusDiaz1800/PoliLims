
"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import type { CondicionAmbiental } from "@/context/data-context";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface HistorialAmbientalChartProps {
  data: CondicionAmbiental[];
  dataKey: 'temperatura' | 'humedad';
  strokeColor: string;
  limits: { min: number; max: number };
}

export function HistorialAmbientalChart({ data, dataKey, strokeColor, limits }: HistorialAmbientalChartProps) {
  const chartData = data.map(d => ({
    ...d,
    fecha: format(parseISO(d.timestamp), 'dd/MM/yy', { locale: es })
  })).sort((a,b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());

  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="fecha" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                    cursor={{fill: 'hsla(var(--accent), 0.3)'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--foreground))'
                    }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} dot={{ r: 2, fill: strokeColor }} />
                 <ReferenceLine y={limits.max} label={{ value: `Máx: ${limits.max}`, position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 10 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                 <ReferenceLine y={limits.min} label={{ value: `Mín: ${limits.min}`, position: 'insideBottomRight', fill: 'hsl(var(--destructive))', fontSize: 10 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
