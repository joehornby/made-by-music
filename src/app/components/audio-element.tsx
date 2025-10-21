"use client";

import { usePlayback } from "@/app/contexts/playback-context";

export default function AudioElement() {
  const { audioRef } = usePlayback();

  return <audio ref={audioRef} preload="metadata" />;
}
