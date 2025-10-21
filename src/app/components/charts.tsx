"use client";

import { cn } from "@/lib/utils";
import ChartCard from "@/app/components/chart-card";
import ChartCardSkeleton from "@/app/components/chart-card-skeleton";
import { useData } from "@/app/contexts/data-context";

export default function Charts({ className }: { className?: string }) {
  const { albums, loading, error } = useData();

  if (loading.albums) {
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
  if (error.albums)
    return <div className="text-red-500">Error: {error.albums}</div>;

  return (
    <div
      className={cn(
        "w-full max-w-full h-full flex flex-col gap-4 items-start justify-start",
        className
      )}
    >
      <p className="text-2xl font-bold">Top Charts</p>
      {albums.slice(0, 3).map((album, index) => (
        <div
          key={album.id}
          className="fade-in w-full"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ChartCard
            imageUrl={album.cover_xl}
            title={album.title}
            description={album.artist.name}
            duration={0} // Albums don't have duration in the API spec
            albumId={album.id.toString()}
          />
        </div>
      ))}
    </div>
  );
}
