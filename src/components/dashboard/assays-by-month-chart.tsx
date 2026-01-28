
"use client";

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle, Cell, LabelList, ReferenceLine, CartesianGrid } from "recharts"
import type { Ensayo } from "@/context/data-context";
import { format, subMonths, getMonth, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

interface AssaysByMonthChartProps {
  data: Ensayo[];
  isModal?: boolean;
}

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
            const fechaStr = (ensayo as any)?.fecha as string | undefined;
            if (!fechaStr || typeof fechaStr !== 'string') {
                return; // sin fecha, omitir
            }
            // Soportar formatos dd-mm-yyyy y yyyy-mm-dd
            const isoLike = fechaStr.includes('-') && fechaStr.split('-')[0].length === 4
              ? fechaStr
              : fechaStr.split('-').reverse().join('-');
            const ensayoDate = parseISO(isoLike);
            if (isNaN(ensayoDate.getTime())) {
                return; // fecha inválida
            }
            const month = getMonth(ensayoDate);
            if (monthlyData[month]) {
                monthlyData[month].total++;
            }
        } catch (_e) {
            // Silenciar errores de parsing para datos incompletos
        }
    });

    return Object.values(monthlyData);
  }, [allData]);

  const average = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    const monthsWithAssays = chartData.filter(month => month.total > 0);
    if (monthsWithAssays.length === 0) return 0;
    const totalAssays = monthsWithAssays.reduce((acc, curr) => acc + curr.total, 0);
    return totalAssays / monthsWithAssays.length;
  }, [chartData]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#22D3EE" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#126FCC" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#FBBF24" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#FB7185" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#FDA4AF" stopOpacity={0.6}/>
                  </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.3} />
              <XAxis 
                  dataKey="name" 
                stroke="#64748B" 
                fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                className="dark:text-slate-300"
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                className="dark:text-slate-300"
              />
              <Tooltip
                  cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
                  contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#1E293B',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      fontSize: '12px'
                  }}
                  labelStyle={{ 
                    color: '#1E293B', 
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                  itemStyle={{ 
                    color: '#1E293B',
                      fontSize: '12px'
                  }}
              />
              <Bar 
                dataKey="total" 
                name="Ensayos" 
                radius={[6, 6, 0, 0]} 
                activeBar={<Rectangle fillOpacity={0.9} stroke="#3B82F6" strokeWidth={2} />}
              >
                {chartData.map((_entry, index) => {
                    const gradients = ['blueGradient', 'purpleGradient', 'cyanGradient', 'emeraldGradient', 'amberGradient', 'roseGradient'];
                    return (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#${gradients[index % gradients.length]})`}
                        />
                    );
                })}
                <LabelList 
                    dataKey="total" 
                    position="top" 
                    fill="#1E293B" 
                    fontSize={11} 
                    fontWeight="600"
                    formatter={(value: number) => (value > 0 ? value : '')} 
                />
              </Bar>
              <ReferenceLine 
                y={average} 
                label={{ 
                    value: `Promedio: ${average.toFixed(1)}`, 
                    position: 'insideTopLeft', 
                    fill: '#3B82F6', 
                    fontSize: 10, 
                    dy: -5,
                    fontWeight: '600'
                }} 
                stroke="#3B82F6" 
                strokeDasharray="5 5"
                strokeWidth={2}
                strokeOpacity={0.7}
              />
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const AssaysByMonthChart = React.memo(AssaysByMonthChartInternal);
