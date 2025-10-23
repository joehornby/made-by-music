"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { AlbumCardProps } from "@/types/album";

export default function AlbumCard({
  className,
  imageUrl,
  albumTitle,
  artistName,
  albumId,
  playUrl,
}: AlbumCardProps) {
  return (
    <Link
      href={playUrl || `/album/${albumId}`}
      className={cn(
        "flex flex-col gap-4 items-start group cursor-pointer w-38 active-scale",
        className
      )}
    >
      <div className="relative super-rounded-lg shrink-0 size-38 overflow-hidden transition-all duration-350 group-hover:duration-120 group-hover:rounded-xl group-hover:scale-105 group-hover:-translate-y-1 album-cover-transition">
        <Image
          alt={albumTitle}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-transform duration-350 group-hover:duration-120 scale-105 group-hover:scale-[1] ease-out"
          src={imageUrl}
          fill
          sizes="152px"
        />
      </div>
      <div className="flex flex-col gap-0.5 items-start">
        <p className="font-normal leading-normal relative text-base text-light group-hover:brightness-150 transition-all duration-350 group-hover:duration-120 ease-out line-clamp-2 overflow-hidden">
          {albumTitle}
        </p>
        <p className="font-normal leading-normal relative text-base text-light/70 line-clamp-2 overflow-hidden">
          {artistName}
        </p>
      </div>
    </Link>
  );
}
