import { useState, useCallback, useRef, useEffect } from "react";

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export function VolumeSlider({
  volume,
  onVolumeChange,
  className = "",
}: VolumeSliderProps) {
  const [localVolume, setLocalVolume] = useState(volume);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update local volume when prop changes
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const debouncedVolumeChange = useCallback(
    (newVolume: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onVolumeChange(newVolume);
      }, 50); // 50ms debounce for smoother updates
    },
    [onVolumeChange]
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume); // Immediate visual feedback
    debouncedVolumeChange(newVolume); // Debounced actual volume change
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-20 h-1 bg-white/10 rounded-full relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localVolume}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="h-full bg-white rounded-full transition-all duration-75 ease-out"
          style={{ width: `${localVolume * 100}%` }}
        />
      </div>
    </div>
  );
}
