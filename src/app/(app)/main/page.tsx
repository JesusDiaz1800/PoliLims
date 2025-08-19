
"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import MainPageContent from '@/components/dashboard/main-page-content';
import { cn } from '@/lib/utils';


export default function MainPage() {
  const { theme } = useTheme();
  return (
    <div className={cn(theme === 'dark' ? 'dashboard-futurista' : 'dashboard-light', '-m-6')}>
      <div className="background-overlay" />
      <div className="relative z-10">
        <MainPageContent />
      </div>
    </div>
  );
}
