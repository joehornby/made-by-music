"use client";

import { usePlayback } from "@/app/contexts/playback-context";
import { useEffect, useState } from "react";
import { getTracks } from "@/lib/api";

export default function AudioTest() {
  const { setPlaylist } = usePlayback();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await getTracks();

        if (response.data.length > 0) {
          const firstTrack = response.data[0];
          setPlaylist([firstTrack]);
          setLoading(false);
        } else {
          setError("No tracks available");
          setLoading(false);
        }
      } catch {
        setError("Failed to fetch track data");
        setLoading(false);
      }
    };

    fetchTrack();
  }, [setPlaylist]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-light text-lg mb-2">Audio Test</h2>
        <p className="text-gray-300 text-sm">Loading track...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-light text-lg mb-2">Audio Test</h2>
        <p className="text-red-300 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-light text-lg mb-2">Audio Test</h2>
      <p className="text-gray-300 text-sm">
        Track loaded successfully! Click the play button in the player controls
        below to start playback.
      </p>
      <p className="text-gray-400 text-xs mt-2">
        This uses the new API with proper audio streaming.
      </p>
    </div>
  );
}