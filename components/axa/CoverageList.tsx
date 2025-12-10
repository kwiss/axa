"use client";

import { CheckCircle, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoverageItem } from "./CoverageItem";

export interface Coverage {
  id: string;
  label: string;
  amount?: string;
  included: boolean;
  description?: string;
  expandable?: boolean;
}

interface CoverageListProps {
  includedItems: Coverage[];
  excludedItems: Coverage[];
  expanded?: boolean;
  onToggleExpand?: () => void;
  onItemClick?: (coverageId: string) => void;
  className?: string;
}

export function CoverageList({
  includedItems,
  excludedItems,
  expanded = false,
  onToggleExpand,
  onItemClick,
  className,
}: CoverageListProps) {
  if (!expanded) {
    return null;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* What's Included Section */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 py-4 bg-white">
          <CheckCircle className="size-6 text-[#138636]" />
          <h3 className="text-sm font-semibold uppercase tracking-[1px] text-[#111B1D]">
            What&apos;s included
          </h3>
        </div>

        {/* Items */}
        <div className="flex flex-col divide-y divide-[#E5E5E5]">
          {includedItems.map((item) => (
            <CoverageItem
              key={item.id}
              id={item.id}
              label={item.label}
              amount={item.amount}
              included={true}
              description={item.description}
              expandable={item.expandable}
              showIcon={true}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </div>
      </div>

      {/* What's Excluded Section */}
      {excludedItems.length > 0 && (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 py-4 bg-[#F0F0F0] px-0 -mx-0">
            <XCircle className="size-6 text-[#C91432]" />
            <h3 className="text-sm font-semibold uppercase tracking-[1px] text-[#111B1D]">
              What&apos;s excluded
            </h3>
          </div>

          {/* Items */}
          <div className="flex flex-col divide-y divide-[#E5E5E5]">
            {excludedItems.map((item) => (
              <CoverageItem
                key={item.id}
                id={item.id}
                label={item.label}
                included={false}
                description={item.description}
                expandable={item.expandable}
                showIcon={true}
                onClick={() => onItemClick?.(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="py-4 text-sm font-semibold uppercase tracking-[1px] text-[#1F1F9C] text-center"
      >
        View less coverages
      </button>

      {/* Documents Section */}
      <div className="flex flex-col gap-4 pt-4 pb-6 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-[#111B1D]" />
          <h3 className="text-base font-bold text-[#111B1D]">Documents</h3>
        </div>

        <a
          href="#"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[1px] text-[#00008F] underline"
        >
          <FileText className="size-4" />
          Terms and conditions
        </a>

        <a
          href="#"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[1px] text-[#00008F] underline"
        >
          <FileText className="size-4" />
          Policy documentation
        </a>
      </div>
    </div>
  );
}
