import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  className?: string;
  containerClassName?: string;
}

export function TableSkeleton({
  count = 5,
  className,
  containerClassName,
  ...props
}: SkeletonProps) {
  return (
    <div className={cn("w-full", containerClassName)} {...props}>
      {/* Header Skeleton */}
      <div className="h-10 bg-muted rounded-md mb-4 animate-pulse" />
      
      {/* Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn("h-12 bg-muted rounded-md animate-pulse", className)}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({
  count = 3,
  className,
  containerClassName,
  ...props
}: SkeletonProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", containerClassName)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow animate-pulse",
            "p-6 space-y-4",
            className
          )}
        >
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({
  count = 4,
  className,
  containerClassName,
  ...props
}: SkeletonProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-6", containerClassName)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
          <div className={cn("h-10 bg-muted rounded-md animate-pulse", className)} />
        </div>
      ))}
      <div className="h-10 bg-primary/20 rounded-md animate-pulse mt-8" />
    </div>
  );
}
