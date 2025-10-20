"use client";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

export default function Topbar({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  const handleClearClick = () => {
    console.log("Clearing search");
    setSearchValue("");
    // Don't refocus to avoid the background flash
  };

  return (
    <div
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
            console.log("Search value changed:", e.target.value);
            setSearchValue(e.target.value);
          }}
          className="bg-transparent border-none outline-none font-bold text-lg text-light placeholder:text-light/25 placeholder:text-base group-focus-within:text-dark group-focus-within:placeholder:text-dark/50 transition-colors duration-[120ms] ease-out flex-1"
        />
      </div>
    </div>
  );
}
