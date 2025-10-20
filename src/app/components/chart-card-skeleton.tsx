"use client";

import { cn } from "@/lib/utils";

export default function ChartCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "super-rounded-lg w-full h-auto p-4 bg-dark-alt flex items-center justify-between gap-8",
        className
      )}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Image skeleton */}
        <div className="w-16 h-16 super-rounded skeleton flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Title skeleton - text-lg height */}
          <div className="h-[17px] skeleton super-rounded-sm w-3/4 mb-1" />
          
          {/* Description skeleton - text-sm height */}
          <div className="h-[12px] skeleton super-rounded-sm w-1/2 mb-1" />
          
          {/* Duration skeleton - text-sm height */}
          <div className="h-[12px] skeleton super-rounded-sm w-1/4" />
        </div>
      </div>
      
      {/* Heart icon skeleton - matches Heart component w-9 h-9 */}
      <div className="w-9 h-9 skeleton rounded-full flex-shrink-0" />
    </div>
  );
}
