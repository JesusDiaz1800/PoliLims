
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  onExpand?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({ title, description, onExpand, children, className }: ChartCardProps) => {
  return (
    <Card className={cn("card-glass relative", className)}>
      {onExpand && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-white/10 hover:text-white z-10"
            onClick={onExpand}
          >
            <Expand className="h-4 w-4" />
          </Button>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
