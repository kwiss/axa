"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";

// Popular destinations with Unsplash images
const DESTINATIONS = [
  { id: "italy", name: "Italy", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=80&h=80&fit=crop" },
  { id: "france", name: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=80&h=80&fit=crop" },
  { id: "spain", name: "Spain", image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=80&h=80&fit=crop" },
  { id: "germany", name: "Germany", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=80&h=80&fit=crop" },
  { id: "canada", name: "Canada", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=80&h=80&fit=crop" },
  { id: "mexico", name: "Mexico", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=80&h=80&fit=crop" },
  { id: "brazil", name: "Brazil", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=80&h=80&fit=crop" },
  { id: "japan", name: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=80&h=80&fit=crop" },
  { id: "australia", name: "Australia", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=80&h=80&fit=crop" },
  { id: "uk", name: "United Kingdom", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=80&h=80&fit=crop" },
  { id: "usa", name: "United States", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=80&h=80&fit=crop" },
  { id: "portugal", name: "Portugal", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=80&h=80&fit=crop" },
  { id: "greece", name: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=80&h=80&fit=crop" },
  { id: "thailand", name: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=80&h=80&fit=crop" },
  { id: "morocco", name: "Morocco", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=80&h=80&fit=crop" },
];

interface DestinationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: string) => void;
  selectedDestination?: string | null;
}

export function DestinationPicker({
  isOpen,
  onClose,
  onSelect,
  selectedDestination,
}: DestinationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter destinations based on search
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return DESTINATIONS;
    const query = searchQuery.toLowerCase();
    return DESTINATIONS.filter((dest) =>
      dest.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (destination: string) => {
    onSelect(destination);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex flex-col gap-6">
        {/* Title + Close */}
        <div className="flex items-center justify-between">
          <h2 className="flex-1 text-xl font-bold leading-7 text-[#111B1D] text-center">
            Where are you travelling?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-6 p-1 rounded hover:bg-[#F0F0F0] transition-colors"
          >
            <X className="size-6 text-[#343C3D]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-[#757575]" />
          <input
            type="text"
            placeholder="Type your destination"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#CCCCCC] bg-white text-base leading-6 text-[#111B1D] placeholder:text-[#757575] outline-none focus:border-[#1F1F9C] transition-colors"
          />
        </div>
      </div>

      {/* Popular Destinations Label */}
      <div className="px-4 pb-4">
        <span className="text-base font-semibold leading-6 text-[#343C3D]">
          Popular destinations
        </span>
      </div>

      {/* Destinations List */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        <div className="flex flex-col gap-3">
          {filteredDestinations.map((dest) => {
            const isSelected = selectedDestination === dest.name;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelect(dest.name)}
                className={cn(
                  "w-full flex items-center gap-4 p-1.5 rounded-lg transition-all",
                  isSelected
                    ? "bg-[rgba(142,187,255,0.2)]"
                    : "bg-white hover:bg-[#F0F0F0]"
                )}
              >
                {/* Country Image */}
                <div className="size-10 rounded overflow-hidden bg-[#D9D9D9] flex-shrink-0 relative">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Name */}
                <span
                  className={cn(
                    "text-base leading-6",
                    isSelected ? "text-[#1F1F9C]" : "text-[#343C3D]"
                  )}
                >
                  {dest.name}
                </span>
              </button>
            );
          })}

          {filteredDestinations.length === 0 && (
            <p className="text-center text-[#757575] py-8">
              No destinations found for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

