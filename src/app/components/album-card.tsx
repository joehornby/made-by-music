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
      href={playUrl || `/play/${albumId}`}
      className={cn(
        "flex flex-col gap-4 items-start group cursor-pointer w-38 active-scale",
        className
      )}
    >
      <div className="relative super-rounded-lg shrink-0 size-38 overflow-hidden transition-all duration-120 group-hover:rounded-3xl">
        <Image
          alt={albumTitle}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-transform duration-120 scale-[1.1] group-hover:scale-[1] ease-out"
          src={imageUrl}
          fill
        />
      </div>
      <div className="flex flex-col gap-0.5 items-start">
        <p className="font-normal leading-normal relative text-base text-light group-hover:font-bold transition-all duration-10 ease-out line-clamp-2 overflow-hidden">
          {albumTitle}
        </p>
        <p className="font-normal leading-normal relative text-base text-light/70 line-clamp-2 overflow-hidden">
          {artistName}
        </p>
      </div>
    </Link>
  );
}
