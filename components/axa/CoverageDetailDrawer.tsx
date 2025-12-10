"use client";

import { X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoverageDetail {
  label: string;
  amount?: string;
}

interface CoverageDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  details: CoverageDetail[];
  className?: string;
}

export function CoverageDetailDrawer({
  isOpen,
  onClose,
  title,
  description,
  details,
  className,
}: CoverageDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(17,27,29,0.5)] z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50",
          className
        )}
      >
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="size-5 text-[#343C3D]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h2 className="text-xl font-bold leading-7 text-[#111B1D] text-center mb-6">
            {title}
          </h2>

          {/* Description */}
          <p className="text-base leading-6 text-[#111B1D] mb-6">
            {description}
          </p>

          {/* Divider */}
          <div className="h-px bg-[#E5E5E5] mb-4" />

          {/* Details List */}
          <div className="flex flex-col gap-4 mb-6">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-base font-semibold leading-6 text-[#111B1D]">
                    {detail.label}
                  </p>
                  {detail.amount && (
                    <p className="text-sm leading-5 text-[#138636]">
                      {detail.amount}
                    </p>
                  )}
                </div>
                <CheckCircle className="size-6 text-[#138636] shrink-0" />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 bg-[#00008F] rounded-lg text-sm font-semibold uppercase tracking-[1px] text-white hover:bg-[#1F1F9C] transition-colors"
          >
            Ok, got it!
          </button>
        </div>
      </div>
    </>
  );
}
