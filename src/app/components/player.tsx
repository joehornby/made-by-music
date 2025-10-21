import { cn } from "@/lib/utils";

export default function Player({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-28 bg-white/10 backdrop-blur-[30px] border-t border-white/10 flex items-center justify-center", className)}>
      <p className="text-2xl font-bold">Player</p>
    </div>
  );
}