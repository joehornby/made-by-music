"use client";
import { cn } from "@/lib/utils";
import AlbumCard from "@/app/components/album-card";
import { Album } from "@/types/album";
import { useState, useRef, useEffect } from "react";

interface CollectionProps {
  name: string;
  className?: string;
  albums: Album[];
}

export default function Collection({
  name,
  className,
  albums,
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
        "w-full flex flex-col gap-5 items-start justify-start mt-12 ",
        className
      )}
    >
      <p className="text-2xl font-bold">{name}</p>
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="flex gap-4 items-start justify-start w-full overflow-x-scroll pb-4 scrollbar-hide"
        >
          {albums.map((album, index) => (
            <AlbumCard
              key={album.id + index}
              imageUrl={album.imageUrl}
              albumTitle={album.title}
              artistName={album.artistName}
              albumId={album.id}
              playUrl={album.playUrl}
            />
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
