"use client";

import BackButton from "./back-button";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  backButtonHref: string;
  backButtonText: string;
  maxWidth?: string;
  className?: string;
}

export default function PageContainer({
  children,
  backButtonHref,
  backButtonText,
  maxWidth = "max-w-6xl",
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={cn("min-h-screen bg-dark text-light page-content-transition", className)}
    >
      {/* Full-width container for back button */}
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <BackButton href={backButtonHref} text={backButtonText} />
          </div>
        </div>
      </div>

      {/* Content container with optional max width */}
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full ${maxWidth}`}
      >
        {children}
      </div>
    </div>
  );
}
