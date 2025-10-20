interface TransportBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TransportBar({ 
  currentTime, 
  duration, 
  onSeek, 
  className = "" 
}: TransportBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration - currentTime;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className={`flex items-center gap-3 max-w-md mx-auto ${className}`}>
      <span className="text-xs text-white/80 font-['FFF_Acid_Grotesk:Normal',_sans-serif] tracking-[0.06px] min-w-[2rem]">
        {formatTime(currentTime)}
      </span>
      <div className="flex-1 relative h-1 bg-white/10 rounded-full">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-white/80 font-['FFF_Acid_Grotesk:Normal',_sans-serif] tracking-[0.06px] min-w-[2rem]">
        {formatTime(remainingTime)}
      </span>
    </div>
  );
}
