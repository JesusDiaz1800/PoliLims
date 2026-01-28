"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const EnhancedCard = React.memo(({ 
  children, 
  className,
  hover = true 
}: EnhancedCardProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cardClasses = cn(
    "rounded-xl p-6 transition-all duration-200 ease-out",
    mounted && theme === "light" ? "card-light-subtle" : "professional-card",
    className
  );

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
});

EnhancedCard.displayName = "EnhancedCard";
