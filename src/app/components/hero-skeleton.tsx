"use client";

import { cn } from "@/lib/utils";

export default function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "super-rounded-xl w-full h-full bg-white/10 flex items-center justify-center overflow-hidden z-0 relative",
        className
      )}
    >
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 skeleton" />
      
      {/* Content skeleton */}
      <div className="bg-dark-alt/20 w-full h-full p-8 relative z-10 flex flex-col items-start justify-between">
        {/* "New Release" skeleton */}
        <div className="h-6 skeleton rounded w-24" />
        
        {/* Title skeleton */}
        <div className="h-10 skeleton rounded w-64" />
        
        {/* Bottom section skeleton */}
        <div className="flex gap-2 items-center">
          {/* Users image skeleton */}
          <div className="w-16 h-5 skeleton rounded" />
          
          {/* Heart icon skeleton */}
          <div className="w-4 h-4 skeleton rounded-full" />
          
          {/* Fans text skeleton */}
          <div className="h-4 skeleton rounded w-16" />
        </div>
      </div>
    </div>
  );
}
