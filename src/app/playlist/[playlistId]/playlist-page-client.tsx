"use client";

import { PlaylistWithTracks } from "@/lib/api";
import Image from "next/image";
import BackButton from "@/app/components/back-button";

interface PlaylistPageClientProps {
  playlist: PlaylistWithTracks;
}

export default function PlaylistPageClient({ playlist }: PlaylistPageClientProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full">
        {/* Back button */}
        <div className="mb-8">
          <BackButton href="/" text="Back to Home" />
        </div>
        
        <div className="flex items-center gap-6 mb-8">
          <Image
            src={playlist.cover}
            alt={playlist.title}
            width={200}
            height={200}
            className="super-rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-lg text-light/70 mb-4">{playlist.description}</p>
            )}
            <p className="text-sm text-light/50 mb-6">{playlist.nb_tracks} tracks</p>
            <button
              disabled
              className="inline-flex items-center gap-3 bg-accent/30 text-light/50 px-6 py-3 rounded-full font-medium cursor-not-allowed"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
              </svg>
              Playlists coming soon
            </button>
          </div>
        </div>
        
        <div className="bg-dark-alt super-rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tracks</h2>
          {playlist.tracks.data.length > 0 ? (
            <div className="space-y-2">
              {playlist.tracks.data.map((track, index) => (
                <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-dark/50 rounded-lg transition-colors">
                  <span className="text-light/50 text-sm w-8">{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-light">{track.title}</h3>
                    <p className="text-sm text-light/70">{track.artist.name}</p>
                  </div>
                  <span className="text-light/50 text-sm">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-light/50">No tracks available</p>
          )}
        </div>
      </div>
    </div>
  );
}
