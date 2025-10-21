"use client";

import { usePlayback } from "@/app/contexts/playback-context";
import { useEffect, useState, useRef } from 'react';
import { type AlbumWithTracks, type Track } from "@/lib/api";

interface AlbumPlayerClientProps {
  album: AlbumWithTracks;
  tracks: Track[];
}

export default function AlbumPlayerClient({
  album,
  tracks,
}: AlbumPlayerClientProps) {
  const { setPlaylist, playTrack } = usePlayback();
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return; // Prevent multiple loads
    hasLoaded.current = true;

    const loadTracks = async () => {
      console.log("AlbumPlayerClient: Loading tracks for album:", album.id);

      console.log("Tracks:", tracks);

      // Set playlist and play first track
      if (tracks.length > 0) {
        console.log("Playing first track immediately:", tracks[0]);
        setPlaylist(tracks);
        playTrack(tracks[0], true); // Enable autoPlay

        setIsLoading(false);
      }
    };

    loadTracks();
  }, [tracks, setPlaylist, playTrack, album.id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/40">
        <div className="text-light text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light mx-auto mb-4"></div>
          <p>Loading tracks...</p>
        </div>
      </div>
    );
  }

  return null; // This component only handles the data loading, UI is in the parent
}