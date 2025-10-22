"use client";
import { useEffect, useState } from "react";
import { search, Album, Track } from "@/lib/api";
import AlbumCard from "@/app/components/album-card";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  query?: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<(Album | Track)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResultClick = (item: Album | Track) => {
    if ('type' in item && item.type === "album") {
      router.push(`/album/${item.id}`);
    } else if ('album' in item) {
      router.push(`/album/${item.album.id}`);
    }
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await search(query);
        setResults(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 200); // Faster debounce for page search
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-light/50 text-lg">Enter a search term to find music</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-dark/20 rounded-xl aspect-square mb-3"></div>
            <div className="bg-dark/20 h-4 rounded mb-2"></div>
            <div className="bg-dark/20 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-light/50 text-lg">No results found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {results.map((item) => {
          if ('type' in item && item.type === "album") {
            return (
              <AlbumCard
                key={`album-${item.id}`}
                className="hover:scale-105 transition-transform duration-200"
                imageUrl={item.cover}
                albumTitle={item.title}
                artistName={item.artist.name}
                albumId={item.id.toString()}
              />
            );
          } else if ('album' in item) {
            // Track item
            return (
              <div
                key={`track-${item.id}`}
                onClick={() => handleResultClick(item)}
                className="bg-dark/20 rounded-xl p-4 hover:bg-dark/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={item.album.cover}
                      alt={item.album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-light font-medium truncate">
                      {item.title}
                    </h3>
                    <p className="text-light/60 text-sm truncate">
                      {item.artist.name}
                    </p>
                    <p className="text-light/40 text-xs">{item.album.title}</p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
