"use client";

import { cn } from "@/lib/utils";
import ChartCard from "@/app/components/chart-card";
import { useData } from "@/app/contexts/data-context";

export default function Charts({ className }: { className?: string }) {
  const { charts, loading, error } = useData();

  if (loading.charts)
    return <div className="text-center">Loading charts...</div>;
  if (error.charts)
    return <div className="text-red-500">Error: {error.charts}</div>;

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-4 items-start justify-start",
        className
      )}
    >
      <p className="text-2xl font-bold">Top Charts</p>
      {charts.map((chart) => (
        <ChartCard
          key={chart.id}
          imageUrl={chart.picture_big}
          title={chart.title}
          description={chart.description}
          duration={chart.duration}
        />
      ))}
    </div>
  );
}
