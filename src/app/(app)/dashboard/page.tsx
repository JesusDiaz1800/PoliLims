
"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import MainPageContent from '@/components/dashboard/main-page-content';
import { cn } from '@/lib/utils';
import { FilterProvider } from '@/context/filter-context';


export default function DashboardPage() {
  const { theme } = useTheme();
  return (
    <FilterProvider>
        <div className={cn(theme === 'dark' ? 'dashboard-futurista' : 'dashboard-light')}>
        <div className="background-overlay" />
        <div className="relative z-10">
            <MainPageContent />
        </div>
        </div>
    </FilterProvider>
  );
}
