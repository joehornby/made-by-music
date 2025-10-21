interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export function VolumeSlider({ 
  volume, 
  onVolumeChange, 
  className = "" 
}: VolumeSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-20 h-1 bg-white/10 rounded-full relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="h-full bg-white rounded-full transition-all duration-150"
          style={{ width: `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
