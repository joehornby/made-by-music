"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Track } from '@/types/album';

interface PreloadContextType {
  preloadedTracks: Map<string, Track>;
  isPreloading: boolean;
  preloadTrack: (albumId: string) => Promise<void>;
  getPreloadedTrack: (albumId: string) => Track | null;
}

const PreloadContext = createContext<PreloadContextType | undefined>(undefined);

export function PreloadProvider({ children }: { children: ReactNode }) {
  const [preloadedTracks, setPreloadedTracks] = useState<Map<string, Track>>(new Map());
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadTrack = useCallback(async (albumId: string) => {
    if (preloadedTracks.has(albumId)) return;

    try {
      const response = await fetch(`/api/tracks/${albumId}`);
      const tracks: Track[] = await response.json();
      
      if (tracks.length > 0) {
        const firstTrack = tracks[0];
        setPreloadedTracks(prev => new Map(prev).set(albumId, firstTrack));
      }
    } catch (error) {
      console.error(`Failed to preload track for album ${albumId}:`, error);
    }
  }, [preloadedTracks]);

  const getPreloadedTrack = useCallback((albumId: string) => {
    return preloadedTracks.get(albumId) || null;
  }, [preloadedTracks]);

  // Critical albums to preload immediately
  useEffect(() => {
    const criticalAlbums = [
      "616582051", // Viewfinder
      "8664043",   // Syro
      // Add more critical albums here
    ];

    const preloadCriticalAlbums = async () => {
      setIsPreloading(true);
      try {
        await Promise.all(criticalAlbums.map(albumId => preloadTrack(albumId)));
      } finally {
        setIsPreloading(false);
      }
    };

    preloadCriticalAlbums();
  }, [preloadTrack]);

  return (
    <PreloadContext.Provider
      value={{
        preloadedTracks,
        isPreloading,
        preloadTrack,
        getPreloadedTrack,
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
