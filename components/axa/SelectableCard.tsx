"use client";

import { cn } from "@/lib/utils";

interface SelectableCardProps {
  title: string;
  icon?: React.ReactNode;
  image?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function SelectableCard({
  title,
  icon,
  image,
  isSelected = false,
  onSelect,
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        // Base: border 1px, padding 6px, rounded 4px, gap 16px
        "w-full flex items-center gap-4 p-1.5 border rounded transition-all text-left",
        isSelected 
          ? "border-[#00008F] bg-[#E8F1FF]" 
          : "border-[#757575] bg-white hover:border-[#00008F]/50",
        className
      )}
    >
      {/* Icon/Image - 40x40px, rounded 4px */}
      <div className={cn(
        "size-10 rounded flex items-center justify-center flex-shrink-0",
        isSelected ? "bg-[#94B5E8]" : "bg-[#D9D9D9]"
      )}>
        {icon && (
          <span className={cn(
            isSelected ? "text-[#00008F]" : "text-[#757575]"
          )}>
            {icon}
          </span>
        )}
        {image && (
          <img src={image} alt="" className="size-full object-cover rounded" />
        )}
      </div>
      
      {/* Text - 14px SemiBold, UPPERCASE, tracking 1px, centered, line-height 16px */}
      <span className={cn(
        "flex-1 text-sm font-semibold uppercase tracking-[1px] leading-4 text-center",
        isSelected ? "text-[#00008F]" : "text-[#343C3D]"
      )}>
        {title}
      </span>
    </button>
  );
}
