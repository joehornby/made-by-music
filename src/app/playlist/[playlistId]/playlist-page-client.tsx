"use client";

import { PlaylistWithTracks } from "@/lib/api";
import Image from "next/image";
import PageContainer from "@/app/components/page-container";

interface PlaylistPageClientProps {
  playlist: PlaylistWithTracks;
}

export default function PlaylistPageClient({ playlist }: PlaylistPageClientProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageContainer backButtonHref="/" backButtonText="Back to Home">
      <div className="grid grid-cols-1 md:grid-cols-[256px_minmax(0,1fr)] items-center md:items-end gap-6 md:gap-8 mb-8">
        <div className="relative mx-auto md:mx-0 w-48 h-48 md:w-64 md:h-64 overflow-hidden super-rounded-lg">
          <Image
            src={playlist.cover}
            alt={playlist.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 256px, 192px"
          />
        </div>
        <div className="flex-1 text-center md:text-left w-full min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 break-words">
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="text-lg md:text-2xl text-light/70 mb-4 break-words">
              {playlist.description}
            </p>
          )}
          <p className="text-sm text-light/60 mb-6">
            {playlist.nb_tracks} tracks
          </p>
          <button
            disabled
            className="inline-flex max-w-full items-center justify-center gap-3 bg-accent/30 text-light/50 px-6 py-3 rounded-full font-medium cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
            </svg>
            Playlists coming soon
          </button>
        </div>
      </div>

      <div className="bg-dark-alt super-rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
          Tracks
        </h2>
        {playlist.tracks.data.length > 0 ? (
          <div className="space-y-2">
            {playlist.tracks.data.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-2 md:gap-4 p-2 md:p-3 super-rounded-lg hover:bg-light/5 transition-colors"
              >
                <span className="text-light/40 w-6 md:w-8 text-center text-sm md:text-base">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm md:text-base text-light truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs md:text-sm text-light/60 truncate">
                    {track.artist.name}
                  </p>
                </div>
                <span className="text-light/40 text-xs md:text-sm flex-shrink-0">
                  {formatDuration(track.duration)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-light/50">No tracks available</p>
        )}
      </div>
    </PageContainer>
  );
}
