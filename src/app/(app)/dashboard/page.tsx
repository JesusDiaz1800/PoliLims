"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import MainPageContent from '@/components/dashboard/main-page-content';
import { cn } from '@/lib/utils';

export default function MainPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar hidratación usando un estado inicial consistente
  const themeClass = mounted 
    ? (resolvedTheme === 'dark' ? 'dashboard-futurista' : 'dashboard-light')
    : 'dashboard-futurista'; // Estado inicial consistente

  return (
    <div className={cn(themeClass, "relative min-h-screen overflow-hidden")}>
      <div className="background-overlay" />
      <div className="relative z-10">
        <MainPageContent />
      </div>
    </div>
  );
}
