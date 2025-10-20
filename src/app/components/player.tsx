"use client";
import { cn } from "@/lib/utils";
import { PreviousButton } from "@/app/components/player-controls/previous";
import { NextButton } from "@/app/components/player-controls/next";
import { PlayPauseButton } from "@/app/components/player-controls/play-pause";
import { VolumeButton } from "@/app/components/player-controls/volume";
import { VolumeSlider } from "@/app/components/player-controls/volume-slider";
import { TransportBar } from "@/app/components/player-controls/transport-bar";
import { usePlayback } from "@/app/contexts/playback-context";
import Heart from "@/app/components/heart";
import Image from "next/image";

// Image assets from Figma
const imgRectangle15 =
  "http://localhost:3845/assets/54d09315c8ff4afed238bbec62b996e928dc5ba3.png";

export default function Player({ className }: { className?: string }) {
  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    setVolume,
    seekTo,
  } = usePlayback();

  return (
    <div
      className={cn(
        "w-full h-28 bg-dark-alt/10 backdrop-blur-[30px] border-t border-white/10 px-4 py-3",
        className
      )}
    >
      <div className="flex items-start justify-between h-full pt-4">
        {/* Left: Album art + Track info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Image
            alt="Album cover"
            width={48}
            height={48}
            className="w-12 h-12 rounded-[14px] object-cover flex-shrink-0"
            src={currentTrack?.imageUrl || imgRectangle15}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base text-light truncate">
                {currentTrack?.title || "No track selected"}
              </h3>
              <Heart isLiked={false} />
            </div>
            <p className="text-sm text-light/50 truncate">
              {currentTrack?.artistName || "Unknown artist"}
            </p>
          </div>
        </div>

        {/* Center: Play controls + Transport bar */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-7">
            <PreviousButton onClick={playPreviousTrack} />
            <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayPause} />
            <NextButton onClick={playNextTrack} />
          </div>
          <TransportBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </div>

        {/* Right: Volume control */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <VolumeButton onClick={() => console.log("Volume control")} />
          <VolumeSlider volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>
    </div>
  );
}
