'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { Track } from '@/types/album';

type PlaybackContextType = {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlayPause: () => void;
  playTrack: (track: Track) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  seekTo: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined
);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [hasEnded, setHasEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = useCallback(async (track: Track) => {
    console.log('playTrack called with:', track);
    setCurrentTrack(track);
    setCurrentTime(0);
    setHasEnded(false); // Reset the ended flag
    if (audioRef.current) {
      console.log('Setting audio src to:', track.audioUrl);
      
      // Pause and reset the audio element before setting new source
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Set the new source
      audioRef.current.src = track.audioUrl;
      audioRef.current.volume = volume;
      
      // Load the audio
      audioRef.current.load();
      
      // Add error handling for audio loading
      const handleError = (e: Event) => {
        console.log('Audio loading error:', e);
        audioRef.current?.removeEventListener('error', handleError);
      };
      
      audioRef.current.addEventListener('error', handleError);
      
      try {
        // Don't auto-play, just prepare the audio
        console.log('Audio prepared, readyState:', audioRef.current.readyState);
      } catch (error) {
        console.log('Audio preparation failed:', error);
      }
    } else {
      console.log('No audioRef.current available in playTrack');
    }
  }, []); // Remove volume from dependencies to prevent recreation

  const togglePlayPause = useCallback(async () => {
    console.log('togglePlayPause called, isPlaying:', isPlaying, 'currentTrack:', currentTrack);
    
    // If no current track, try to play the first track in the playlist
    if (!currentTrack && playlist.length > 0) {
      console.log('No current track, playing first track from playlist');
      playTrack(playlist[0]);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          console.log('Attempting to play audio, src:', audioRef.current.src);
          
          // Ensure the audio is ready
          if (audioRef.current.readyState < 2) {
            console.log('Audio not ready, waiting for canplay event');
            try {
              await Promise.race([
                new Promise((resolve) => {
                  const handleCanPlay = () => {
                    audioRef.current?.removeEventListener('canplay', handleCanPlay);
                    resolve(void 0);
                  };
                  audioRef.current?.addEventListener('canplay', handleCanPlay);
                }),
                new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('Audio load timeout')), 5000);
                })
              ]);
            } catch (error) {
              console.log('Audio load failed or timed out:', error);
              // Try to play anyway, might work
            }
          }
          
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Play failed:', error);
          // Keep isPlaying as false if play fails
        }
      }
    } else {
      console.log('No audioRef.current available');
    }
  }, [isPlaying, currentTrack, playlist, playTrack]);

  const playNextTrack = useCallback(() => {
    console.log('playNextTrack called, currentTrack:', currentTrack?.title, 'playlist length:', playlist.length);
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      console.log('Current index:', currentIndex, 'Next index:', nextIndex, 'Next track:', playlist[nextIndex]?.title);
      playTrack(playlist[nextIndex]);
    } else {
      console.log('Cannot play next track - no current track or empty playlist');
    }
  }, [currentTrack, playlist, playTrack]);

  const playPreviousTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[previousIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Manual check for track end (in case 'ended' event doesn't fire)
      if (!hasEnded && audio.duration > 0 && audio.currentTime >= audio.duration - 0.1) {
        console.log('Manual track end detection');
        setHasEnded(true);
        handleEnded();
      }
    };
    const handleDurationChange = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      console.log('Track ended, playing next track');
      setHasEnded(true);
      setIsPlaying(false);
      playNextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNextTrack]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [togglePlayPause]);

  return (
    <PlaybackContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        togglePlayPause,
        playTrack,
        playNextTrack,
        playPreviousTrack,
        setCurrentTime,
        setDuration,
        setVolume: handleVolumeChange,
        setPlaylist,
        seekTo,
        audioRef,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
