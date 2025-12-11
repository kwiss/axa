"use client";

import { Pencil, Plus } from "lucide-react";

// Destination images mapping (same as DestinationPicker)
const DESTINATION_IMAGES: Record<string, string> = {
  italy: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=200&h=200&fit=crop",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop",
  spain: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=200&h=200&fit=crop",
  germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop",
  canada: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=200&h=200&fit=crop",
  mexico: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=200&h=200&fit=crop",
  brazil: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=200&h=200&fit=crop",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=200&h=200&fit=crop",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop",
  "united kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop",
  usa: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=200&h=200&fit=crop",
  "united states": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=200&h=200&fit=crop",
  portugal: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=200&h=200&fit=crop",
  greece: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&h=200&fit=crop",
  thailand: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=200&h=200&fit=crop",
  morocco: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=200&h=200&fit=crop",
};

// Default fallback image
const DEFAULT_DESTINATION_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop";

interface PriceItem {
  label: string;
  price: number;
  pricePerTraveler?: number;
}

interface OrderSummaryCardProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  planName: string;
  planPrice: number;
  planPricePerTraveler: number;
  options: PriceItem[];
  taxes: number;
  totalPrice: number;
  onEditTrip?: () => void;
  onEditPlan?: () => void;
  onEditOptions?: () => void;
  onAddPromoCode?: () => void;
}

export function OrderSummaryCard({
  destination,
  startDate,
  endDate,
  travelers,
  planName,
  planPrice,
  planPricePerTraveler,
  options,
  taxes,
  totalPrice,
  onEditTrip,
  onEditPlan,
  onEditOptions,
  onAddPromoCode,
}: OrderSummaryCardProps) {
  // Format price with European format
  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Get destination image
  const getDestinationImage = (dest: string) => {
    const key = dest.toLowerCase().replace("to ", "").trim();
    return DESTINATION_IMAGES[key] || DEFAULT_DESTINATION_IMAGE;
  };

  // Extract destination name (remove "To " prefix if present)
  const destinationName = destination.startsWith("To ") 
    ? destination 
    : `To ${destination}`;

  return (
    <div className="rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Trip Summary Header */}
      <div className="bg-[#E8F1FF] p-5 relative">
        <div className="flex gap-5">
          {/* Destination Image */}
          <div className="size-[76px] rounded-md overflow-hidden flex-shrink-0">
            <img
              src={getDestinationImage(destination)}
              alt={destination}
              className="size-full object-cover"
            />
          </div>

          {/* Trip Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xl font-semibold leading-7 text-[#1F1F9C]">
              {destinationName}
            </p>
            <p className="text-base leading-6 text-[#111B1D]">
              {startDate} - {endDate}
            </p>
            <p className="text-base leading-6 text-[#111B1D]">
              {travelers} traveller{travelers > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        {onEditTrip && (
          <button
            type="button"
            onClick={onEditTrip}
            className="absolute top-5 right-5 p-1 hover:bg-[#00008F]/10 rounded transition-colors"
            aria-label="Edit trip details"
          >
            <Pencil className="size-[14px] text-[#1F1F9C]" />
          </button>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-white p-5">
        {/* Title */}
        <h3 className="text-xl font-bold leading-7 text-[#111B1D] mb-4">
          Pricing breakdown
        </h3>

        {/* Plan Section */}
        <div className="pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-base leading-6 text-[#757575]">Plan</span>
            {onEditPlan && (
              <button
                type="button"
                onClick={onEditPlan}
                className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
              >
                <Pencil className="size-[14px] text-[#1F1F9C]" />
              </button>
            )}
          </div>
          <div className="flex items-start justify-between">
            <span className="text-lg font-semibold leading-7 text-[#1F1F9C]">
              {planName}
            </span>
            <div className="text-right">
              <p className="text-lg font-semibold leading-7 text-[#111B1D]">
                {formatPrice(planPrice)}€
              </p>
              <p className="text-xs leading-4 text-[#111B1D] text-right">
                {formatPrice(planPricePerTraveler)}€/travellers
              </p>
            </div>
          </div>
        </div>

        {/* Options Section */}
        {options.length > 0 && (
          <div className="py-3 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-base leading-6 text-[#757575]">Options</span>
              {onEditOptions && (
                <button
                  type="button"
                  onClick={onEditOptions}
                  className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
                >
                  <Pencil className="size-[14px] text-[#1F1F9C]" />
                </button>
              )}
            </div>
            {options.map((option, index) => (
              <div key={index} className="flex items-start justify-between mt-0.5">
                <span className="text-lg font-semibold leading-7 text-[#1F1F9C]">
                  {option.label}
                </span>
                <div className="text-right">
                  <p className="text-lg font-semibold leading-7 text-[#111B1D]">
                    {formatPrice(option.price)}€
                  </p>
                  {option.pricePerTraveler && (
                    <p className="text-xs leading-4 text-[#111B1D] text-right">
                      {formatPrice(option.pricePerTraveler)}€/travellers
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Taxes Section */}
        <div className="py-2 border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-base leading-6 text-[#111B1D]">Taxes</span>
            <p className="text-lg font-semibold leading-7 text-[#111B1D]">
              {formatPrice(taxes)}€
            </p>
          </div>
        </div>

        {/* Total Section */}
        <div className="py-3 border-b border-[#E5E5E5]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold leading-7 text-[#111B1D]">
                Total price
              </p>
              <p className="text-sm leading-4 text-[#111B1D]">
                Pay in X3 without fees
              </p>
            </div>
            <p className="text-2xl font-semibold leading-7 text-[#111B1D]">
              {formatPrice(totalPrice)}€
            </p>
          </div>
        </div>

        {/* Add Promo Code */}
        {onAddPromoCode && (
          <button
            type="button"
            onClick={onAddPromoCode}
            className="flex items-center gap-2 mt-3 text-base font-semibold text-[#00008F] hover:opacity-80 transition-opacity"
          >
            <Plus className="size-4" />
            <span className="capitalize">Add promo code</span>
          </button>
        )}
      </div>
    </div>
  );
}
