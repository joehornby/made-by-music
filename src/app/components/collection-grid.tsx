"use client";

import CollectionCard from "@/app/components/collection-card";
import { useData } from "@/app/contexts/data-context";
import { cn } from "@/lib/utils";
import { Playlist, Track } from "@/lib/api";

interface EnrichedPlaylist extends Playlist {
  tracks: { data: Track[]; total: number };
}

interface CollectionGridProps {
  className?: string;
  enrichedPlaylists?: EnrichedPlaylist[];
}

export default function CollectionGrid({ className, enrichedPlaylists = [] }: CollectionGridProps) {
  const { collections, playlists, loading, error } = useData();

  if (error.collections && error.playlists) {
    return (
      <div className="text-red-500">
        Error loading collections and playlists
      </div>
    );
  }

  const isLoading = loading.collections || loading.playlists;

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full",
        className
      )}
    >
      {isLoading ? (
        // Show skeleton cards while loading
        Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="relative w-full aspect-square super-rounded-xl overflow-hidden animate-pulse"
          >
            {/* 2x2 Montage Skeleton */}
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-700" />
              ))}
            </div>
            
            {/* Text Overlay Skeleton */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
              <div className="space-y-1">
                <div className="h-6 bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-600 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          {/* Collections */}
          {collections.map((collection, index) => (
            <div
              key={`collection-${collection.id}`}
              className="fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
          
          {/* Playlists with enriched data */}
          {(enrichedPlaylists.length > 0 ? enrichedPlaylists : playlists).map((playlist, index) => (
            <div
              key={`playlist-${playlist.id}`}
              className="fade-in"
              style={{ animationDelay: `${(collections.length + index) * 0.05}s` }}
            >
              <CollectionCard 
                playlist={playlist} 
                enrichedPlaylist={enrichedPlaylists.find(p => p.id === playlist.id)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
