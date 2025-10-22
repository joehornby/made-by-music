"use client";

import { cn } from "@/lib/utils";
import { Collection, Playlist, Album, Track } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

interface EnrichedPlaylist extends Playlist {
  tracks: { data: Track[]; total: number };
}

interface CollectionCardProps {
  collection?: Collection;
  playlist?: Playlist;
  enrichedPlaylist?: EnrichedPlaylist;
  className?: string;
}

export default function CollectionCard({ 
  collection, 
  playlist, 
  enrichedPlaylist,
  className 
}: CollectionCardProps) {
  const isPlaylist = !!playlist;
  const title = collection?.title || playlist?.title || "";
  const id = collection?.id || playlist?.id || "";

  // Get albums for artist display (collections use their albums, playlists use track albums)
  const albumsForArtists = collection?.albums || (enrichedPlaylist?.tracks.data.map(track => track.album) || []);
  const isLoading = false; // No longer loading since data is fetched on server

  // Get unique artists for display
  const artists = albumsForArtists.reduce((acc: string[], album) => {
    if (album.artist?.name && !acc.includes(album.artist.name)) {
      acc.push(album.artist.name);
    }
    return acc;
  }, []);

  const allArtists = artists.join(", ");

  // For collections: create 2x2 montage from albums
  // For playlists: use single cover image
  const isCollection = !!collection;
  const montageImages = isCollection ? albumsForArtists.slice(0, 4) : [];
  
  // Fill empty slots for collections if we have fewer than 4 albums
  if (isCollection) {
    while (montageImages.length < 4) {
      montageImages.push({
        id: -montageImages.length, // Use negative numbers for placeholders
        title: "",
        artist: { id: 0, name: "", type: "artist" as const },
        cover: "",
        cover_xl: "",
        release_date: "",
        type: "album" as const
      });
    }
  }

  const linkHref = isPlaylist 
    ? `/playlist/${id}` 
    : collection?.albums && collection.albums.length > 0 
      ? `/album/${collection.albums[0].id}` 
      : '#';

  return (
    <Link href={linkHref} className="block group">
      <div
        className={cn(
          "relative w-full aspect-square super-rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 hover:rounded-xl",
          className
        )}
      >
        {/* Background Image */}
        {isLoading ? (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        ) : isCollection ? (
          /* Collections: 2x2 montage */
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            {montageImages.map((album) => (
              <div
                key={album.id}
                className="relative overflow-hidden"
              >
                {album.cover_xl ? (
                  <Image
                    src={album.cover_xl}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700" />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Playlists: single cover image */
          <div className="relative w-full h-full">
            {playlist?.cover ? (
              <Image
                src={playlist.cover}
                alt={playlist.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700" />
            )}
          </div>
        )}

        {/* Text Overlay */}
        <div className="absolute inset-0 gradient-fade-b flex flex-col justify-end px-6 py-0">
          <div className="group-hover:-translate-y-8 transition-transform duration-200">
            <h3 className="text-2xl font-normal text-light truncate">
              {title}
            </h3>
            <div className="text-sm text-gray-300 mt-1 overflow-hidden">
              {/* Default: truncated text */}
              <p className="truncate group-hover:hidden">
                {allArtists}
              </p>
              {/* Hover: marquee text */}
              <div className="hidden group-hover:block animate-marquee whitespace-nowrap">
                <span>{allArtists}</span>
              </div>
            </div>
          </div>
          
          {/* Count - hidden by default, shown on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 pb-2">
            <p className="text-xs text-light/50 pb-4">
              {isPlaylist 
                ? `${playlist?.nb_tracks || 0} tracks`
                : `${albumsForArtists.length} albums`
              }
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
