"use client";

import { usePlayback } from '@/app/contexts/playback-context';
import { usePreload } from '@/app/contexts/preload-context';
import { useEffect, useState, useRef } from 'react';
import { Album, Track } from '@/types/album';

interface AlbumPlayerClientProps {
  album: Album;
  tracks: Track[];
}

export default function AlbumPlayerClient({ album, tracks }: AlbumPlayerClientProps) {
  const { setPlaylist, playTrack } = usePlayback();
  const { getPreloadedTrack } = usePreload();
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return; // Prevent multiple loads
    hasLoaded.current = true;
    
    const loadTracks = async () => {
      console.log('AlbumPlayerClient: Loading tracks for album:', album.id);
      
      // Use the album's tracks
      const preloadedTrack = getPreloadedTrack(album.id);
      console.log('Preloaded track:', preloadedTrack);
      
      let finalTracks: Track[];
      if (preloadedTrack && tracks.length > 0) {
        const remainingTracks = tracks.slice(1);
        finalTracks = [preloadedTrack, ...remainingTracks];
      } else {
        finalTracks = tracks;
      }
      
      // Play the first track immediately with its current URL
      if (finalTracks.length > 0) {
        console.log('Playing first track immediately:', finalTracks[0]);
        setPlaylist(finalTracks);
        playTrack(finalTracks[0]);
        setIsLoading(false);
      }
      
      // Then fetch fresh URLs for all tracks in the background
      const tracksWithFreshUrls: Track[] = [];
      
      for (const track of finalTracks) {
        try {
          // Try to get a fresh preview URL for this track
          const response = await fetch(`/api/track-preview?trackId=${track.id}`);
          const data = await response.json();
          
          if (data.success && data.track) {
            console.log(`Got fresh URL for track ${track.title}:`, data.track.audioUrl);
            tracksWithFreshUrls.push(data.track);
          } else {
            console.log(`Failed to get fresh URL for track ${track.title}, using original`);
            tracksWithFreshUrls.push(track);
          }
        } catch (error) {
          console.log(`Error getting fresh URL for track ${track.title}:`, error);
          tracksWithFreshUrls.push(track);
        }
      }
      
      // Update the playlist with fresh URLs (this will happen after first track starts playing)
      console.log('Updated playlist with fresh URLs:', tracksWithFreshUrls);
      setPlaylist(tracksWithFreshUrls);
    };

    loadTracks();
  }, [tracks, setPlaylist, getPreloadedTrack, album.id]); // Removed playTrack from dependencies

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/40">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading tracks...</p>
        </div>
      </div>
    );
  }

  return null; // This component only handles the data loading, UI is in the parent
}
