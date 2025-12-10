"use client";

import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  children: React.ReactNode;
  avatarSrc?: string;
  className?: string;
}

export function InfoTooltip({ 
  children, 
  avatarSrc = "/avatar.png",
  className 
}: InfoTooltipProps) {
  return (
    <div className={cn(
      "bg-[#D9EAEC] p-4 rounded-lg flex gap-2.5",
      className
    )}>
      {/* Avatar */}
      <div className="size-[30px] rounded-full bg-[#94B5E8] flex-shrink-0 overflow-hidden">
        {avatarSrc && (
          <img 
            src={avatarSrc} 
            alt="" 
            className="size-full object-cover"
            onError={(e) => {
              // Hide image on error
              (e.target as HTMLImageElement).style.display = 'none';
            }}
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

