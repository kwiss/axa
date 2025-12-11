"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X, Pencil } from "lucide-react";

interface PriceItem {
  label: string;
  price: number;
  pricePerTraveler?: number;
  onEdit?: () => void;
}

interface PriceBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  planPricePerTraveler: number;
  options: PriceItem[];
  taxes: number;
  totalPrice: number;
  travelersCount: number;
  onEditPlan?: () => void;
  onEditOptions?: () => void;
}

export function PriceBreakdownDrawer({
  isOpen,
  onClose,
  planName,
  planPrice,
  planPricePerTraveler,
  options,
  taxes,
  totalPrice,
  travelersCount,
  onEditPlan,
  onEditOptions,
}: PriceBreakdownDrawerProps) {
  // Format price with European format
  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="bg-white rounded-t-2xl px-6 pt-4 pb-6 max-h-[80vh] overflow-y-auto [&>button]:hidden"
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
          >
            <X className="size-6 text-[#343C3D]" />
          </button>
        </div>

        {/* Title */}
        <SheetTitle className="text-xl font-bold leading-7 text-[#111B1D] mb-6">
          Pricing breakdown
        </SheetTitle>

        {/* Plan Section */}
        <div className="pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm leading-5 text-[#757575]">Plan</span>
            {onEditPlan && (
              <button
                type="button"
                onClick={onEditPlan}
                className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
              >
                <Pencil className="size-4 text-[#757575]" />
              </button>
            )}
          </div>
          <div className="flex items-start justify-between">
            <span className="text-base font-semibold leading-6 text-[#1F1F9C]">
              {planName}
            </span>
            <div className="text-right">
              <p className="text-base font-semibold leading-6 text-[#111B1D]">
                {formatPrice(planPrice)}€
              </p>
              <p className="text-xs leading-4 text-[#757575]">
                {formatPrice(planPricePerTraveler)}€/travellers
              </p>
            </div>
          </div>
        </div>

        {/* Options Section */}
        {options.length > 0 && (
          <div className="py-4 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm leading-5 text-[#757575]">Options</span>
              {onEditOptions && (
                <button
                  type="button"
                  onClick={onEditOptions}
                  className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
                >
                  <Pencil className="size-4 text-[#757575]" />
                </button>
              )}
            </div>
            {options.map((option, index) => (
              <div key={index} className="flex items-start justify-between mt-2">
                <span className="text-base font-semibold leading-6 text-[#1F1F9C]">
                  {option.label}
                </span>
                <div className="text-right">
                  <p className="text-base font-semibold leading-6 text-[#111B1D]">
                    {formatPrice(option.price)}€
                  </p>
                  {option.pricePerTraveler && (
                    <p className="text-xs leading-4 text-[#757575]">
                      {formatPrice(option.pricePerTraveler)}€/travellers
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Taxes Section */}
        <div className="py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-sm leading-5 text-[#757575]">Taxes</span>
            <p className="text-base font-semibold leading-6 text-[#111B1D]">
              {formatPrice(taxes)}€
            </p>
          </div>
        </div>

        {/* Total Section */}
        <div className="pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-bold leading-6 text-[#111B1D]">
                Total price
              </p>
              <p className="text-xs leading-4 text-[#757575]">
                Pay in X3 without fees
              </p>
            </div>
            <p className="text-xl font-bold leading-7 text-[#111B1D]">
              {formatPrice(totalPrice)}€
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
