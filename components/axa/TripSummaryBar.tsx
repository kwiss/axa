"use client";

import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripSummaryBarProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  onEdit?: () => void;
  className?: string;
}

export function TripSummaryBar({
  destination,
  startDate,
  endDate,
  travelers,
  onEdit,
  className,
}: TripSummaryBarProps) {
  return (
    <div
      className={cn(
        "bg-[#E8F1FF] px-6 py-1.5 flex items-center justify-between",
        className
      )}
    >
      {/* Trip Info */}
      <div className="flex flex-col items-start justify-center">
        <p className="text-sm font-semibold leading-5 text-[#1F1F9C]">
          {destination}
        </p>
        <div className="flex items-start gap-1">
          <span className="text-xs leading-4 text-[#111B1D]">
            {startDate} - {endDate},
          </span>
          <span className="text-xs leading-4 text-[#111B1D]">
            {travelers} traveler{travelers > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="size-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Edit trip details"
        >
          <Pencil className="size-[14px] text-[#1F1F9C]" />
        </button>
      )}
    </div>
  );
}
