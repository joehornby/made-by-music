"use client";

import Link from "next/link";

interface BackButtonProps {
  href: string;
  text: string;
  className?: string;
}

export default function BackButton({ href, text, className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 text-light hover:text-light/80 transition-colors ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L5.414 9H17a1 1 0 1 1 0 2H5.414l4.293 4.293a1 1 0 0 1 0 1.414Z"
          clipRule="evenodd"
        />
      </svg>
      {text}
    </Link>
  );
}
