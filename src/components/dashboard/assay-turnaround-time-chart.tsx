
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Ensayo } from "@/context/data-context";
import { differenceInDays, parse } from "date-fns";

interface AssayTurnaroundTimeChartProps {
    data: Ensayo[];
}

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
            .map(nameAndDurations => ({
                name: nameAndDurations[0],
                value: nameAndDurations[1].length > 0 ? nameAndDurations[1].reduce((a, b) => a + b, 0) / nameAndDurations[1].length : 0,
            }))
            .filter(item => item.value > 0);
    }, [allData]);

  return (
    <>
      <CardHeader>
        <CardTitle>Tiempo de Respuesta Promedio</CardTitle>
        <CardDescription>Promedio de días por tipo de ensayo.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}d`} />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="value" name="Días" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="hsl(var(--primary) / 0.8)" />} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  )
}
export const AssayTurnaroundTimeChart = React.memo(AssayTurnaroundTimeChartInternal);
