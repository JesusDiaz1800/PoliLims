
"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

interface AssaysByTypeChartProps {
  data: any[];
}

export function AssaysByTypeChart({ data }: AssaysByTypeChartProps) {
  const chartData = React.useMemo(() => {
    const typeCounts: { [key: string]: number } = {};
    
    data.forEach(item => {
      const type = item.tipo || 'Sin Tipo';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [data]);

  const colors = [
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#F43F5E', // Rose
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#84CC16', // Lime
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 6, right: 6, left: 2, bottom: 22 }} barCategoryGap={8}>
        <defs>
          <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
            <stop offset="50%" stopColor="#FBBF24" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.6}/>
          </linearGradient>
                     <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#126FCC" stopOpacity={1}/>
             <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.8}/>
             <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6}/>
           </linearGradient>
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
          <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity={1}/>
            <stop offset="50%" stopColor="#FB7185" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FDA4AF" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
            <stop offset="50%" stopColor="#22D3EE" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
            <stop offset="50%" stopColor="#F87171" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84CC16" stopOpacity={1}/>
            <stop offset="50%" stopColor="#A3E635" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#BEF264" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#64748B"
          fontSize={9}
          angle={-40}
          textAnchor="end"
          tickLine={false}
          axisLine={false}
          height={48}
          className="dark:text-slate-300"
        />
        <YAxis 
          stroke="#64748B"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={24}
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
          dataKey="value"
          name="Ensayos" 
          radius={[6, 6, 0, 0]}
          activeBar={{ fillOpacity: 0.9, stroke: '#3B82F6', strokeWidth: 2 }}
        >
          {chartData.map((entry, index) => {
            const gradients = ['amberGradient', 'emeraldGradient', 'blueGradient', 'purpleGradient', 'roseGradient', 'cyanGradient', 'redGradient', 'limeGradient'];
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#${gradients[index % gradients.length]})`}
              />
            );
          })}
          <LabelList 
            dataKey="value" 
            position="top" 
            fill="#1E293B" 
            fontSize={9} 
            fontWeight="600"
            formatter={(value: number) => (value > 0 ? value : '')} 
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
