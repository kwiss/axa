"use client";

import { CheckCircle, XCircle, ChevronRight, Clock, Briefcase, Plane, Activity, HeadphonesIcon, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping for coverage types
const COVERAGE_ICONS: Record<string, React.ElementType> = {
  "trip-duration": Clock,
  "medical-expenses": Briefcase,
  "medical-assistance": Clock,
  "travel-assistance": HeadphonesIcon,
  "compensation": Scale,
  "baggage": Briefcase,
  "trip-cancellation": Plane,
  "sport": Activity,
};

interface CoverageItemProps {
  id?: string;
  label: string;
  amount?: string;
  included: boolean;
  description?: string;
  expandable?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CoverageItem({
  id,
  label,
  amount,
  included,
  description,
  expandable = false,
  showIcon = false,
  onClick,
  className,
}: CoverageItemProps) {
  const IconComponent = id ? COVERAGE_ICONS[id] : null;

  // Simple inline view (for the summary list)
  if (!showIcon) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-1 min-h-6",
          className
        )}
      >
        <p
          className={cn(
            "text-base font-semibold leading-6 flex-1",
            included ? "text-[#111B1D]" : "text-[#999999]"
          )}
        >
          {label}
          {amount && included && (
            <span className="text-[#138636] ml-1">{amount}</span>
          )}
        </p>

        {included ? (
          <CheckCircle className="size-5 text-[#138636] shrink-0" />
        ) : (
          <XCircle className="size-5 text-[#999999] shrink-0" />
        )}
      </div>
    );
  }

  // Detailed view with icon (for expanded coverage list)
  return (
    <button
      type="button"
      onClick={expandable ? onClick : undefined}
      disabled={!expandable}
      className={cn(
        "w-full flex items-start gap-3 py-4 text-left",
        expandable && "cursor-pointer hover:bg-[#FAFAFA]",
        !expandable && "cursor-default",
        className
      )}
    >
      {/* Icon */}
      {IconComponent && (
        <IconComponent
          className={cn(
            "size-5 shrink-0 mt-0.5",
            included ? "text-[#111B1D]" : "text-[#999999]"
          )}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-base font-semibold leading-6",
            included ? "text-[#111B1D]" : "text-[#999999]"
          )}
        >
          {label}
        </p>
        {description && (
          <p
            className={cn(
              "text-sm leading-5 mt-0.5",
              included ? "text-[#138636]" : "text-[#757575]"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Chevron or Status Icon */}
      {expandable ? (
        <ChevronRight className="size-5 text-[#343C3D] shrink-0" />
      ) : null}
    </button>
  );
}
