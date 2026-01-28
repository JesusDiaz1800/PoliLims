/**
 * This file defines lazy-loaded components for the application
 * to improve initial load time and performance.
 */

import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Default loading skeleton for charts
const ChartSkeleton = () => (
  <div className="w-full h-full min-h-[240px] flex items-center justify-center">
    <Skeleton className="w-full h-[240px] rounded-md" />
  </div>
);

// Simple lazy loading wrapper
const createLazyComponent = (importFn: () => Promise<any>, fallback: React.ReactNode) => {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load dashboard charts - using centralized exports
export const LazyAssaysByMonthChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.AssaysByMonthChart })),
  <ChartSkeleton />
);

export const LazyAssaysByTypeChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.AssaysByTypeChart })),
  <ChartSkeleton />
);

export const LazySampleStatusChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.SampleStatusChart })),
  <ChartSkeleton />
);

export const LazyWorkloadDistributionChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.WorkloadDistributionChart })),
  <ChartSkeleton />
);

export const LazyThroughputTrendChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.ThroughputTrendChart })),
  <ChartSkeleton />
);

export const LazyAssayTurnaroundTimeChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.AssayTurnaroundTimeChart })),
  <ChartSkeleton />
);

export const LazyNonConformitiesByTypeChart = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.NonConformitiesByTypeChart })),
  <ChartSkeleton />
);

export const LazyEquipmentAlertsCard = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.EquipmentAlertsCard })),
  <div className="p-6">
    <Skeleton className="h-6 w-2/3 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const LazyRecentActivityList = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.RecentActivityList })),
  <div className="space-y-2">
    {Array(5).fill(0).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export const LazyDashboardFilters = createLazyComponent(
  () => import('@/components/dashboard').then(mod => ({ default: mod.DashboardFilters })),
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
  </div>
);

// Create a map of all lazy-loaded components for the dashboard
export const DashboardLazyComponents = {
  AssaysByMonthChart: LazyAssaysByMonthChart,
  AssaysByTypeChart: LazyAssaysByTypeChart,
  SampleStatusChart: LazySampleStatusChart,
  WorkloadDistributionChart: LazyWorkloadDistributionChart,
  ThroughputTrendChart: LazyThroughputTrendChart,
  AssayTurnaroundTimeChart: LazyAssayTurnaroundTimeChart,
  NonConformitiesByTypeChart: LazyNonConformitiesByTypeChart,
  EquipmentAlertsCard: LazyEquipmentAlertsCard,
  RecentActivityList: LazyRecentActivityList,
  DashboardFilters: LazyDashboardFilters,
};