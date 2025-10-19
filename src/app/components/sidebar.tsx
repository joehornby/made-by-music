import { cn } from "@/lib/utils";
export default function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("super-rounded-xl w-full h-[calc(100vh-32px)] sticky top-4 bg-white/10 flex items-center justify-center", className)}>
      <p className="text-base font-bold">Sidebar</p>
    </div>
  );
}