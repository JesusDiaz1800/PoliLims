"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
  padding?: string;
}

export const ChartContainer = React.memo(({ 
  children, 
  className, 
  height = "h-full",
  padding = "p-2"
}: ChartContainerProps) => {
  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      height,
      padding,
      className
    )}>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
});

ChartContainer.displayName = "ChartContainer";

// Componente específico para gráficos de barras
export const BarChartContainer = React.memo(({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <ChartContainer 
      className={cn("min-h-[200px]", className)}
      padding="p-4"
    >
      {children}
    </ChartContainer>
  );
});

BarChartContainer.displayName = "BarChartContainer";

// Componente específico para gráficos circulares
export const PieChartContainer = React.memo(({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <ChartContainer 
      className={cn("min-h-[200px]", className)}
      padding="p-2"
    >
      {children}
    </ChartContainer>
  );
});

PieChartContainer.displayName = "PieChartContainer";

// Componente específico para gráficos de líneas
export const LineChartContainer = React.memo(({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <ChartContainer 
      className={cn("min-h-[240px]", className)}
      padding="p-4"
    >
      {children}
    </ChartContainer>
  );
});

LineChartContainer.displayName = "LineChartContainer";
