"use client";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LiveSearchResults from "./live-search-results";
import { Album, Track } from "@/lib/api";

export default function Topbar({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showLiveResults, setShowLiveResults] = useState(false);
  const router = useRouter();

  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  const handleClearClick = () => {
    setSearchValue("");
    setShowLiveResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setShowLiveResults(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleResultClick = (item: Album | Track) => {
    setShowLiveResults(false);
    if ("type" in item && item.type === "album") {
      router.push(`/album/${item.id}`);
    } else if ("album" in item) {
      router.push(`/album/${item.album.id}`);
    }
  };

  // Close live results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowLiveResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "super-rounded-xl bg-dark/10 backdrop-blur-[30px] z-50 relative w-full h-full flex items-center group focus-within:bg-light/50 transition-all duration-[30ms] ease-out cursor-text",
        className
      )}
      onClick={handleSearchClick}
    >
      <div className="flex gap-6 items-center pl-6 w-full">
        <div
          className="relative shrink-0 size-4 cursor-pointer"
          onMouseDown={searchValue ? handleClearClick : handleSearchClick}
        >
          {searchValue ? (
            <X className="size-4 text-light group-focus-within:text-dark transition-colors duration-[30ms] ease-out" />
          ) : (
            <Search className="size-4 text-light/50 group-focus-within:text-dark transition-colors duration-[30ms] ease-out" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setShowLiveResults(e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          className="bg-transparent border-none outline-none font-bold text-lg text-light placeholder:text-light/25 placeholder:text-base group-focus-within:text-dark group-focus-within:placeholder:text-dark/50 transition-colors duration-[120ms] ease-out flex-1"
        />
      </div>

      {showLiveResults && (
        <LiveSearchResults
          query={searchValue}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
}
