"use client";

import Collection from "@/app/components/collection";
import { useData } from "@/app/contexts/data-context";

export default function Collections() {
  const { collections, loading, error } = useData();

  if (error.collections)
    return <div className="text-red-500">Error: {error.collections}</div>;

  return (
    <div className="flex flex-col gap-4 w-full col-span-full overflow-visible">
      {loading.collections
        ? // Show skeleton collections while loading
          Array.from({ length: 3 }).map((_, index) => (
            <Collection
              key={`skeleton-collection-${index}`}
              name=""
              className="col-span-full"
              albums={[]}
              isLoading={true}
            />
          ))
        : // Show real collections with fade-in animation
          collections.map((collection, index) => (
            <div
              key={collection.name + index}
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Collection
                name={collection.name}
                className="col-span-full"
                albums={collection.albums}
                isLoading={false}
              />
            </div>
          ))}
    </div>
  );
}
