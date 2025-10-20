"use client";

import { usePlayback } from "@/app/contexts/playback-context";
import { useEffect, useState } from "react";

export default function AudioTest() {
  const { setPlaylist } = usePlayback();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch('/api/test-track');
        const data = await response.json();
        
        if (data.success && data.track) {
          setPlaylist([data.track]);
          setLoading(false);
        } else {
          setError(data.error || 'Failed to load track');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch track data');
        setLoading(false);
      }
    };

    fetchTrack();
  }, [setPlaylist]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-white text-lg mb-2">Audio Test</h2>
        <p className="text-gray-300 text-sm">Loading track...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-white text-lg mb-2">Audio Test</h2>
        <p className="text-red-300 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-white text-lg mb-2">Audio Test</h2>
      <p className="text-gray-300 text-sm">
        Track loaded successfully! Click the play button in the player controls below to start playback.
      </p>
      <p className="text-gray-400 text-xs mt-2">
        This uses a fresh preview URL from the Deezer API.
      </p>
    </div>
  );
}
