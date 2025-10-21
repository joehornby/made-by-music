"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}

export default function ViewTransitionLink({
  href,
  children,
  className,
  onMouseEnter,
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Start view transition
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      // Fallback for browsers without view transitions
      router.push(href);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      onMouseEnter={onMouseEnter}
      prefetch={true}
    >
      {children}
    </Link>
  );
}
