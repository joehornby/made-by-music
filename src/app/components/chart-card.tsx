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
        "super-rounded-xl w-full h-auto p-4 bg-dark-alt flex items-center justify-between",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Image
          src={imageUrl}
          alt="Chart"
          width={64}
          height={64}
          className="super-rounded"
        />
        <div>
          <h3 className="text-lg font-bold text-light">{title}</h3>
          <p className="text-base text-light/50">{description}</p>
          <p className="text-base text-light">{formatDuration(duration)}</p>
        </div>
      </div>
      <Heart isLiked={isLiked} onToggle={setIsLiked} />
    </div>
  );
}
