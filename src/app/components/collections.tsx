"use client";

import Collection from "@/app/components/collection";
import { useData } from "@/app/contexts/data-context";
import { type Album as LegacyAlbum } from "@/types/album";
import { type Album as ApiAlbum } from "@/lib/api";
import { cn } from "@/lib/utils";

// Transform API Album to legacy Album format
function transformApiAlbumToLegacy(apiAlbum: ApiAlbum): LegacyAlbum {
  return {
    id: apiAlbum.id.toString(),
    title: apiAlbum.title,
    artistName: apiAlbum.artist.name,
    imageUrl: apiAlbum.cover_xl,
    playUrl: `/album/${apiAlbum.id}`,
    releaseDate: apiAlbum.release_date,
    duration: 0, // Albums don't have duration in API spec
    trackCount: 0, // Will be updated when tracks are loaded
    genre: "Unknown", // Not available in API spec
    label: "Unknown", // Not available in API spec
    fans: 0, // Not available in API spec
    explicitLyrics: false, // Not available in API spec
  };
}

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
                albums={collection.albums.map(transformApiAlbumToLegacy)}
                isLoading={false}
              />
            </div>
          ))}
    </div>
  );
}
