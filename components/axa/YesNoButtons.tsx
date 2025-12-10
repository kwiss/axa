"use client";

import { cn } from "@/lib/utils";

interface YesNoButtonsProps {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  className?: string;
}

export function YesNoButtons({ value, onChange, className }: YesNoButtonsProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <button
        type="button"
        onClick={() => onChange?.(true)}
        className={cn(
          "w-[102px] h-12 px-6 rounded-lg border text-sm font-semibold uppercase tracking-[1px] transition-all flex items-center justify-center outline-none focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]",
          value === true
            ? "border-[#1F1F9C] bg-[rgba(142,187,255,0.2)] text-[#1F1F9C]"
            : "border-[#1F1F9C] bg-transparent text-[#343C3D] hover:bg-[#00008F]/5"
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange?.(false)}
        className={cn(
          "w-[102px] h-12 px-6 rounded-lg border text-sm font-semibold uppercase tracking-[1px] transition-all flex items-center justify-center outline-none focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]",
          value === false
            ? "border-[#1F1F9C] bg-[rgba(142,187,255,0.2)] text-[#1F1F9C]"
            : "border-[#1F1F9C] bg-transparent text-[#343C3D] hover:bg-[#00008F]/5"
        )}
      >
        No
      </button>
    </div>
  );
}

