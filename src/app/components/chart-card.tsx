"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import Heart from "@/app/components/heart";

const formatDuration = (duration: number) => {
  const date = new Date();
  date.setSeconds(duration);
  return date.toISOString().slice(11, 19).replace("00:", "");
}

export default function ChartCard({
  imageUrl,
  title,
  description,
  duration,
  className,
}: {
  imageUrl: string;
  title: string;
  description: string;
  duration: number;
  className?: string;
}) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div
      className={cn(
        "cursor-pointer super-rounded-lg w-full h-auto p-4 bg-dark-alt flex items-center justify-between gap-8 hover:bg-light/5 text-left group/chart active-scale",
        className
      )}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Image
          src={imageUrl}
          alt="Chart"
          width={64}
          height={64}
          className="super-rounded flex-shrink-0 group-hover/chart:rounded-xl transition-all duration-120"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-regular text-light truncate">{title}</h3>
          <p className="text-sm text-light/50 truncate">{description}</p>
          <p className="text-sm text-light mt-1">{formatDuration(duration)}</p>
        </div>
      </div>
      <Heart isLiked={isLiked} onToggle={setIsLiked} />
    </div>
  );
}
