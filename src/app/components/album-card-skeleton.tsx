"use client";

import { cn } from "@/lib/utils";

export default function AlbumCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-start w-38",
        className
      )}
    >
      {/* Album cover skeleton */}
      <div className="relative super-rounded-lg shrink-0 size-38 overflow-hidden">
        <div className="absolute inset-0 skeleton" />
      </div>
      
      {/* Text content skeleton */}
      <div className="flex flex-col gap-0.5 items-start w-full">
        {/* Album title skeleton */}
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-3/4" />
        
        {/* Artist name skeleton */}
        <div className="h-4 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}
