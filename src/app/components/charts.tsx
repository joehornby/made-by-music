import { cn } from "@/lib/utils";
import ChartCard from "@/app/components/chart-card";

export default function Charts({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-4 items-start justify-start",
        className
      )}
    >
      <p className="text-2xl font-normal">Top Charts</p>
      <ChartCard
        imageUrl="https://cdn-images.dzcdn.net/images/cover/229fc5df8f97df64ca717b5c7a6895a7/1000x1000-000000-80-0-0.jpg"
        title="UK Top 40"
        description="19 October 2025"
        duration={7650}
      />
    </div>
  );
}