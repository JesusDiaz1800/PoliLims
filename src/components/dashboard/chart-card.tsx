
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartModal } from "./chart-modal";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  isModal?: boolean;
}

export const ChartCard = ({ title, description, children, className, isModal = false }: ChartCardProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const ChartContentComponent = isModal ? (
    <div className="w-full h-full p-4">{children}</div>
  ) : (
    <div className="w-full h-[240px]">{children}</div>
  );

  return (
    <>
      <Card className={cn("h-full card-glass relative group cursor-pointer", className)} onClick={() => setIsModalOpen(true)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {ChartContentComponent}
        </CardContent>
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Expand className="h-4 w-4 text-white/70" />
        </div>
      </Card>
      <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={title}>
        <div className="w-full h-full p-4">{children}</div>
      </ChartModal>
    </>
  );
};
