import { cn } from "@/lib/utils";
import { AudioVisualiser } from "@/app/components/audio-visualiser";

export default function HeroSection({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "super-rounded-xl w-full h-full bg-white/10 flex items-center justify-center overflow-hidden z-0",
        className
      )}
    >
      <AudioVisualiser />
      <div className="absolute inset-0 bg-gradient-to-b to-dark/10 z-50" />
    </div>
  );
}