"use client";

import { cn } from "@/lib/utils";
import ChartCard from "@/app/components/chart-card";
import ChartCardSkeleton from "@/app/components/chart-card-skeleton";
import { useData } from "@/app/contexts/data-context";

export default function Charts({ className }: { className?: string }) {
  const { charts, loading, error } = useData();

  if (loading.charts) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col gap-4 items-start justify-start",
          className
        )}
      >
        <p className="text-2xl font-bold">Top Charts</p>
        {Array.from({ length: 3 }).map((_, index) => (
          <ChartCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (error.charts)
    return <div className="text-red-500">Error: {error.charts}</div>;

  return (
    <div
      className={cn(
        "w-full max-w-full h-full flex flex-col gap-4 items-start justify-start",
        className
      )}
    >
      <p className="text-2xl font-bold">Top Charts</p>
      {charts.slice(0, 3).map((chart, index) => (
        <div
          key={chart.id}
          className="fade-in w-full"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ChartCard
            imageUrl={chart.picture_big}
            title={chart.title}
            description={chart.description}
            duration={chart.duration}
          />
        </div>
      ))}
    </div>
  );
}
