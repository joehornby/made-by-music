import { cn } from "@/lib/utils";

export default function HeroSection({ className }: { className?: string }) {
  return (
    <div className={cn("super-rounded-xl w-full h-full bg-white/10 flex items-center justify-center", className)}>
      <p className="text-2xl font-bold">Hero Section</p>
    </div>
  );
}