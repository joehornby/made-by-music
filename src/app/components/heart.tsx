"use client";

import { cn } from "@/lib/utils";

type HeartProps = {
  isLiked: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export default function Heart({
  isLiked,
  onToggle,
  disabled,
  className,
}: HeartProps) {
  return (
    <button
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike" : "Like"}
      disabled={disabled}
      onClick={() => onToggle?.(!isLiked)}
      className={`relative w-9 h-9 cursor-pointer transition-all duration-120 border-2 border-light/10 hover:scale-105 rounded-full group hover:bg-accent ${className} flex items-center justify-center`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.15388 7.69874C0.349134 5.18624 1.28963 2.31449 3.92738 1.46474C5.31488 1.01699 6.84638 1.28099 7.99988 2.14874C9.09113 1.30499 10.6789 1.01999 12.0649 1.46474C14.7026 2.31449 15.6491 5.18624 14.8451 7.69874C13.5926 11.6812 7.99988 14.7487 7.99988 14.7487C7.99988 14.7487 2.44838 11.7277 1.15388 7.69874Z"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isLiked ? "stroke-dark fill-accent" : "stroke-accent fill-transparent", "group-hover:stroke-dark")}
        />
        <path
          opacity="0.4"
          d="M11 4.02502C11.8025 4.28452 12.3695 5.00077 12.4377 5.84152"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isLiked ? "stroke-dark" : "stroke-accent", "group-hover:stroke-dark")}
        />
      </svg>

    </button>
  );
}
