
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, LabelList, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { differenceInDays, parse } from "date-fns";

interface AssayTurnaroundTimeChartProps {
    data: Ensayo[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="font-bold text-foreground text-xs">{label}</p>
        <p className="text-xs text-muted-foreground">
            Tiempo promedio: <span className="font-bold text-foreground">{payload[0].value.toFixed(1)} días</span>
        </p>
      </div>
    );
  }
  return null;
};

const assayChecks: { name: string, field: keyof Ensayo }[] = [
    { name: "Melt Index", field: "meltIndexCalculado" },
    { name: "Densidad", field: "densidadCalculada" },
    { name: "Tracción", field: "resistencia_traccion" },
    { name: "% N.H.", field: "negroHumoCalculado" },
    { name: "TIO", field: "tio_tiempo" },
];

const AssayTurnaroundTimeChartInternal = ({ data: allData }: AssayTurnaroundTimeChartProps) => {
    const chartData = React.useMemo(() => {
        const turnarounds: { [key: string]: number[] } = {};

        assayChecks.forEach(check => {
            turnarounds[check.name] = [];
        });

        allData.forEach(ensayo => {
            if (ensayo.fecha_ingreso && ensayo.fecha) {
                try {
                    const ingreso = parse(ensayo.fecha_ingreso, 'dd-MM-yyyy', new Date());
                    const fin = parse(ensayo.fecha, 'dd-MM-yyyy', new Date());
                    
                    if (!isNaN(ingreso.getTime()) && !isNaN(fin.getTime())) {
                        const duration = differenceInDays(fin, ingreso);

                        assayChecks.forEach(check => {
                            if (ensayo[check.field] !== null && ensayo[check.field] !== undefined) {
                                turnarounds[check.name].push(duration);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore date parsing errors
                }
            }
        });

        return Object.entries(turnarounds)
            .map(([name, durations], index) => {
                const avg = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
                return {
                    name,
                    value: avg,
                    fill: `hsl(var(--chart-${(index % 5) + 1}))`
                };
            })
            .filter(item => item.value > 0)
            .sort((a, b) => a.value - b.value);
    }, [allData]);

  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">Tiempo de Respuesta</CardTitle>
        <CardDescription>Promedio de días por tipo de ensayo.</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pb-2">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 25, left: -10, bottom: 0 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}d`} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={false}
                    content={<CustomTooltip />}
                />
                <Bar dataKey="value" name="Días" radius={[0, 2, 2, 0]} barSize={12}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList 
                        dataKey="value" 
                        position="right" 
                        offset={8}
                        className="fill-foreground font-semibold"
                        fontSize={10}
                        formatter={(value: number) => value > 0 ? value.toFixed(1) : ''}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssayTurnaroundTimeChart = React.memo(AssayTurnaroundTimeChartInternal);
