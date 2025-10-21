"use client";

import Collection from "@/app/components/collection";
import { useData } from "@/app/contexts/data-context";

export default function Collections() {
  const { collections, loading, error } = useData();

  if (loading.collections)
    return <div className="text-center">Loading collections...</div>;
  if (error.collections)
    return <div className="text-red-500">Error: {error.collections}</div>;

  return (
    <div className="mt-12 flex flex-col gap-4 w-full col-span-full">
      {collections.map((collection, index) => (
        <Collection
          key={collection.name + index}
          name={collection.name}
          className="col-span-full"
          albums={collection.albums}
        />
      ))}
    </div>
  );
}
