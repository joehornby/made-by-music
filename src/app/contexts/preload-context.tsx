"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Track, Album } from "@/types/album";

interface PreloadContextType {
  preloadedTracks: Map<string, Track>;
  preloadedAlbums: Map<string, Album>;
  isPreloading: boolean;
  preloadTrack: (albumId: string) => Promise<void>;
  preloadAlbum: (albumId: string) => Promise<void>;
  getPreloadedTrack: (albumId: string) => Track | null;
  getPreloadedAlbum: (albumId: string) => Album | null;
}

const PreloadContext = createContext<PreloadContextType | undefined>(undefined);

export function PreloadProvider({ children }: { children: ReactNode }) {
  const [preloadedTracks, setPreloadedTracks] = useState<Map<string, Track>>(
    new Map()
  );
  const [preloadedAlbums, setPreloadedAlbums] = useState<Map<string, Album>>(
    new Map()
  );
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadTrack = useCallback(
    async (albumId: string) => {
      if (preloadedTracks.has(albumId)) return;

      try {
        const response = await fetch(`/api/tracks/${albumId}`);
        const tracks: Track[] = await response.json();

        if (tracks.length > 0) {
          const firstTrack = tracks[0];
          setPreloadedTracks((prev) => new Map(prev).set(albumId, firstTrack));
        }
      } catch (error) {
        console.error(`Failed to preload track for album ${albumId}:`, error);
      }
    },
    [preloadedTracks]
  );

  const preloadAlbum = useCallback(
    async (albumId: string) => {
      if (preloadedAlbums.has(albumId)) return;

      try {
        const response = await fetch(`/api/album/${albumId}`);
        const album: Album = await response.json();
        setPreloadedAlbums((prev) => new Map(prev).set(albumId, album));
      } catch (error) {
        console.error(`Failed to preload album ${albumId}:`, error);
      }
    },
    [preloadedAlbums]
  );

  const getPreloadedTrack = useCallback(
    (albumId: string) => {
      return preloadedTracks.get(albumId) || null;
    },
    [preloadedTracks]
  );

  const getPreloadedAlbum = useCallback(
    (albumId: string) => {
      return preloadedAlbums.get(albumId) || null;
    },
    [preloadedAlbums]
  );

  // Critical albums to preload immediately
  useEffect(() => {
    const criticalAlbums = [
      "616582051", // Viewfinder
      "8664043", // Syro
      "302127", // Discovery
      // Add more critical albums here
    ];

    const preloadCriticalAlbums = async () => {
      setIsPreloading(true);
      try {
        await Promise.all([
          ...criticalAlbums.map((albumId) => preloadTrack(albumId)),
          ...criticalAlbums.map((albumId) => preloadAlbum(albumId)),
        ]);
      } finally {
        setIsPreloading(false);
      }
    };

    preloadCriticalAlbums();
  }, [preloadTrack, preloadAlbum]);

  return (
    <PreloadContext.Provider
      value={{
        preloadedTracks,
        preloadedAlbums,
        isPreloading,
        preloadTrack,
        preloadAlbum,
        getPreloadedTrack,
        getPreloadedAlbum,
      }}
    >
      {children}
    </PreloadContext.Provider>
  );
}

export function usePreload() {
  const context = useContext(PreloadContext);
  if (context === undefined) {
    throw new Error('usePreload must be used within a PreloadProvider');
  }
  return context;
}
