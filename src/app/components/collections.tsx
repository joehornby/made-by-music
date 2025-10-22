"use client";

import Collection from "@/app/components/collection";
import { useData } from "@/app/contexts/data-context";
import { cn } from "@/lib/utils";

interface CollectionsProps {
  className?: string;
}

export default function Collections({ className }: CollectionsProps) {
  const { collections, loading, error } = useData();

  if (error.collections)
    return <div className="text-red-500">Error: {error.collections}</div>;

  return (
    <div
      className={cn("flex flex-col gap-4 w-full overflow-visible", className)}
    >
      {loading.collections
        ? // Show skeleton collections while loading
          Array.from({ length: 3 }).map((_, index) => (
            <Collection
              key={`skeleton-collection-${index}`}
              name=""
              albums={[]}
              isLoading={true}
            />
          ))
        : // Show real collections with fade-in animation
          collections.map((collection, index) => (
            <div
              key={collection.id + index}
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Collection
                name={collection.title}
                albums={collection.albums}
                isLoading={false}
              />
            </div>
          ))}
    </div>
  );
}
