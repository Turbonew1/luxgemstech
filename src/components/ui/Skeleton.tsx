import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("animate-shimmer rounded-lg bg-neutral-100", className)}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-0 overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function SkeletonText({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}
