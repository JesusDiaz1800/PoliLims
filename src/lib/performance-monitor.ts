/**
 * Performance monitoring utility for PoliLims
 * 
 * This module provides functions to measure and log performance metrics
 * for critical operations in the application.
 */

// Monitor de rendimiento para métricas clave
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    this.observeFCP();
    
    // Time to Interactive
    this.observeTTI();
    
    // Largest Contentful Paint
    this.observeLCP();
    
    // Cumulative Layout Shift
    this.observeCLS();
    
    // First Input Delay
    this.observeFID();
  }

  private observeFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        this.metrics.fcp = fcp.startTime;
        console.log(`🚀 FCP: ${fcp.startTime.toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  private observeTTI(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tti = entries[entries.length - 1];
        this.metrics.tti = tti.startTime;
        console.log(`⚡ TTI: ${tti.startTime.toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.metrics.lcp = lcp.startTime;
        console.log(`📊 LCP: ${lcp.startTime.toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        this.metrics.cls = clsValue;
        console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[entries.length - 1] as any;
        this.metrics.fid = fid.processingStart - fid.startTime;
        console.log(`🎯 FID: ${(fid.processingStart - fid.startTime).toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  logSummary(): void {
    console.group('📈 Métricas de Rendimiento - PoliLims');
    Object.entries(this.metrics).forEach(([key, value]) => {
      console.log(`${key.toUpperCase()}: ${value.toFixed(2)}ms`);
    });
    console.groupEnd();
  }
}

// Inicializar automáticamente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startMonitoring();
  
  // Log summary después de 3 segundos
  setTimeout(() => {
    monitor.logSummary();
  }, 3000);
}