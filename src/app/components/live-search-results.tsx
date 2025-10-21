"use client";
import { useEffect, useState, useRef } from "react";
import { search, Album, Track } from "@/lib/api";
import { cn } from "@/lib/utils";

interface LiveSearchResultsProps {
  query: string;
  onResultClick: (item: Album | Track) => void;
  className?: string;
}

export default function LiveSearchResults({ 
  query, 
  onResultClick, 
  className 
}: LiveSearchResultsProps) {
  const [results, setResults] = useState<(Album | Track)[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Rate limiting: 500ms debounce
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await search(query.trim());
        setResults(response.data.slice(0, 8)); // Limit to 8 results for dropdown
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  if (!showResults || results.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 bg-dark/95 backdrop-blur-xl rounded-xl border border-light/10 shadow-2xl z-50 max-h-96 overflow-y-auto",
      className
    )}>
      <div className="p-2">
        {loading ? (
          <div className="p-4 text-center text-light/50">Searching...</div>
        ) : (
          <div className="space-y-1">
            {results.map((item) => (
              <div
                key={item.type === "album" ? `album-${item.id}` : `track-${item.id}`}
                onClick={() => onResultClick(item)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-light/10 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                  {item.type === "album" ? (
                    <img 
                      src={item.cover} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <img 
                      src={item.album.cover} 
                      alt={item.album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-light font-medium truncate">
                    {item.title}
                  </h4>
                  <p className="text-light/60 text-sm truncate">
                    {item.artist.name}
                  </p>
                  {item.type === "track" && (
                    <p className="text-light/40 text-xs truncate">
                      {(item as Track).album.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
