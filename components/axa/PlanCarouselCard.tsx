"use client";

import { cn } from "@/lib/utils";

interface PlanCarouselCardProps {
  name: string;
  price: number;
  currency?: string;
  isSelected?: boolean;
  isRecommended?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PlanCarouselCard({
  name,
  price,
  currency = "€",
  isSelected = false,
  isRecommended = false,
  onSelect,
  className,
}: PlanCarouselCardProps) {
  // Format price with European format
  const formattedPrice = price.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center rounded-lg shrink-0 w-[207px] bg-white",
        // Simple shadow, no overflow issues
        "shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]",
        // Selected state: blue border
        isSelected && "border-2 border-[#00008F]",
        className
      )}
    >
      {/* Badge - visible when recommended (always shown for Essential) */}
      {isRecommended ? (
        <div className="w-full bg-[#00008F] rounded-t-md px-1.5 py-1 flex items-center justify-center">
          <span className="text-sm font-semibold leading-6 text-white">
            Recommanded for you
          </span>
        </div>
      ) : (
        // Empty space to keep same height
        <div className="w-full h-[34px]" />
      )}

      {/* Card Content */}
      <div className="w-full flex flex-col items-start px-3.5 py-4">
        <p className="text-base font-semibold leading-6 text-[#111B1D]">
          {name}
        </p>
        <p className="text-xl font-bold leading-7 text-[#111B1D]">
          {formattedPrice} {currency}
        </p>
      </div>
    </button>
  );
}
