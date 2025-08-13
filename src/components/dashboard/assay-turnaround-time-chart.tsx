
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, Cell } from "recharts"
import type { Ensayo } from "@/context/data-context";
import { differenceInDays, parse } from "date-fns";

interface AssayTurnaroundTimeChartProps {
    data: Ensayo[];
    isModal?: boolean;
}

const assayChecks: { name: string, field: keyof Ensayo }[] = [
    { name: "Melt Index", field: "meltIndexCalculado" },
    { name: "Densidad", field: "densidadCalculada" },
    { name: "Tracción", field: "resistencia_traccion" },
    { name: "% N.H.", field: "negroHumoCalculado" },
    { name: "TIO", field: "tio_tiempo" },
];

const AssayTurnaroundTimeChartInternal = ({ data: allData, isModal = false }: AssayTurnaroundTimeChartProps) => {
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
    
    const height = isModal ? 500 : 240;

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                  <linearGradient id="colorTurnaround1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                  </linearGradient>
                   <linearGradient id="colorTurnaround2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                  </linearGradient>
              </defs>
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}d`} />
              <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} stroke="#888888" tickLine={false} axisLine={false} />
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
              <Bar dataKey="value" name="Días" radius={[0, 4, 4, 0]} activeBar={<Rectangle fillOpacity={0.8} />}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#colorTurnaround1)" : "url(#colorTurnaround2)"} />
                  ))}
              </Bar>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export const AssayTurnaroundTimeChart = React.memo(AssayTurnaroundTimeChartInternal);
