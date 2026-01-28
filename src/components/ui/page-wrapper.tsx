"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  isDashboard?: boolean;
}

export const PageWrapper = React.memo(({ 
  children, 
  className,
  isDashboard = false 
}: PageWrapperProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // No aplicar estilos especiales al dashboard
  if (isDashboard) {
    return <>{children}</>;
  }

  const wrapperClasses = cn(
    "main-content-wrapper",
    mounted && theme === "dark" ? "main-content-wrapper-dark" : "main-content-wrapper-light",
    mounted && theme === "light" && "light-theme-subtle",
    className
  );

  return (
    <div className={wrapperClasses}>
      {children}
    </div>
  );
});

PageWrapper.displayName = "PageWrapper";
