"use client";
import { cn } from "@/lib/utils";
import AlbumCard from "@/app/components/album-card";
import AlbumCardSkeleton from "@/app/components/album-card-skeleton";
import { Album } from "@/lib/api";
import { useState, useRef, useEffect } from "react";

interface CollectionProps {
  name: string;
  className?: string;
  albums: Album[];
  isLoading?: boolean;
}

export default function Collection({
  name,
  className,
  albums,
  isLoading = false,
}: CollectionProps) {
  const [showRightFade, setShowRightFade] = useState(true);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding errors
      const isAtStart = scrollLeft <= 1; // -1 for rounding errors
      setShowRightFade(!isAtEnd);
      setShowLeftFade(!isAtStart);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial state
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-5 items-start justify-start",
        className
      )}
    >
      {isLoading ? (
        <div className="h-8 skeleton rounded w-48" />
      ) : (
        name && <p className="text-2xl font-bold">{name}</p>
      )}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 items-start justify-start w-full overflow-x-scroll overflow-y-visible pt-4 pb-4 scrollbar-hide"
        >
          {isLoading
            ? // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <AlbumCardSkeleton key={`skeleton-${index}`} />
              ))
            : // Show real album cards with fade-in animation
              albums.map((album, index) => (
                <div
                  key={album.id + index}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <AlbumCard
                    imageUrl={album.cover_xl}
                    albumTitle={album.title}
                    artistName={album.artist.name}
                    albumId={album.id.toString()}
                    playUrl={`/album/${album.id}`}
                  />
                </div>
              ))}
        </div>
        <div
          className={`absolute top-0 left-0 w-32 h-full gradient-fade-r pointer-events-none transition-opacity duration-120 ease-in-out ${
            showLeftFade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-32 h-full gradient-fade-l pointer-events-none transition-opacity duration-120 ease-in-out ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
