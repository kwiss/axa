"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  children: React.ReactNode;
  avatarSrc?: string;
  className?: string;
}

// Default helper avatar - friendly professional
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face";

export function InfoTooltip({ 
  children, 
  avatarSrc = DEFAULT_AVATAR,
  className 
}: InfoTooltipProps) {
  return (
    <div className={cn(
      "bg-[#D9EAEC] p-4 rounded-lg flex gap-2.5",
      className
    )}>
      {/* Avatar */}
      <div className="size-[30px] rounded-full bg-[#94B5E8] flex-shrink-0 overflow-hidden relative">
        {avatarSrc && (
          <Image 
            src={avatarSrc} 
            alt="" 
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      
      {/* Text */}
      <p className="text-sm leading-5 text-[#014750] flex-1">
        {children}
      </p>
    </div>
  );
}

