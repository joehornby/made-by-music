import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function Topbar({ className }: { className?: string }) {
  return (
    <div className={cn("super-rounded-xl w-full h-full bg-white/10 flex items-center justify-center", className)}>
      <Search className="size-4" />
      <input type="text" placeholder="Search" className="text-2xl font-bold" />
    </div>
  );
}