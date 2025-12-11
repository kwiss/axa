"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Header,
  TripSummaryBar,
  HelpModal,
  PriceBreakdownDrawer,
} from "@/components/axa";
import { AddOnCardV2 } from "@/components/axa/AddOnCardV2";
import type { AddOnBenefit } from "@/components/axa/AddOnCardV2";
import { Button } from "@/components/ui/button";
import { useFunnelStore, useTripSummary, type AddOnType } from "@/lib/store";

// Plan prices
const PLAN_PRICES: Record<string, number> = {
  basic: 32.23,
  essential: 62.23,
  premium: 86.23,
};

// Add-ons data
interface AddOnData {
  type: AddOnType;
  title: string;
  titleSecondLine?: string;
  price: number;
  benefits: AddOnBenefit[];
}

const ADD_ONS_DATA: AddOnData[] = [
  {
    type: "sport",
    title: "Sport insurance",
    price: 12.50,
    benefits: [
      { label: "Medical expenses for sports accidents", highlight: "100,000 €" },
      { label: "Rescue & evacuation costs", highlight: "250,000 €" },
      { label: "Equipment reimbursement", highlight: "up to 5,000 €" },
    ],
  },
  {
    type: "luggages",
    title: "Luggages insurance",
    price: 12.50,
    benefits: [
      { label: "Reimbursement for lost or stolen bags", highlight: "up to 500 €" },
      { label: "Coverage for damaged belongings", highlight: "up to 500 €" },
      { label: "Delay compensation", highlight: "500 €" },
    ],
  },
  {
    type: "cancel-any-reason",
    title: "Cancel for any reason",
    price: 12.50,
    benefits: [
      { label: "Flexible cancellation" },
      { label: "Reimbursement", highlight: "up to X% of your trip cost" },
      { label: "Quick refund process" },
    ],
  },
  {
    type: "missed-connection",
    title: "Missed connection",
    price: 32.50,
    benefits: [
      { label: "Reimbursement of extra travel costs", highlight: "up to 2,000 €" },
      { label: "Coverage for delays caused by the airline, weather disruptions, or unexpected events." },
      { label: "Support to help you reach your destination" },
    ],
  },
  {
    type: "electronics",
    title: "Electronics &",
    titleSecondLine: "Valuables cover",
    price: 12.50,
    benefits: [
      { label: "Reimbursement if your electronics are lost, stolen, or damaged", highlight: "up to 2,000 €" },
      { label: "Coverage for valuable items", highlight: "up to 5,000 €" },
    ],
  },
];

// Plan names mapping
const PLAN_NAMES: Record<string, string> = {
  basic: "Basic",
  essential: "Essential",
  premium: "Premium",
};

export default function AddOnsPage() {
  const router = useRouter();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  
  // Use Zustand store
  const { selectedPlanId, selectedAddOns, addAddOn, removeAddOn } = useFunnelStore();
  const tripSummary = useTripSummary();
  const travelersCount = tripSummary.travelers;
  
  const basePrice = PLAN_PRICES[selectedPlanId] || PLAN_PRICES.essential;
  const planName = PLAN_NAMES[selectedPlanId] || "Essential";

  // Calculate add-ons total
  const addOnsTotal = useMemo(() => {
    let total = 0;
    selectedAddOns.forEach((type) => {
      const addOn = ADD_ONS_DATA.find((a) => a.type === type);
      if (addOn) {
        total += addOn.price;
      }
    });
    return total;
  }, [selectedAddOns]);
  
  // Convert array to Set for checking
  const selectedAddOnsSet = useMemo(() => new Set(selectedAddOns), [selectedAddOns]);

  // Calculate taxes (example: 10% of subtotal)
  const subtotal = basePrice + addOnsTotal;
  const taxes = subtotal * 0.1;

  // Calculate total price
  const totalPrice = subtotal + taxes;

  // Get selected add-ons as price items for the drawer
  const selectedAddOnItems = useMemo(() => {
    return selectedAddOns.map((type) => {
      const addOn = ADD_ONS_DATA.find((a) => a.type === type);
      return {
        label: addOn?.title || type,
        price: (addOn?.price || 0) * travelersCount,
        pricePerTraveler: addOn?.price || 0,
      };
    });
  }, [selectedAddOns, travelersCount]);

  // Format price with European format
  const formattedPrice = totalPrice.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleBack = () => {
    router.back();
  };

  const handleEditTrip = () => {
    router.push("/form");
  };

  const handleAddAddOn = (type: AddOnType) => {
    addAddOn(type);
  };

  const handleRemoveAddOn = (type: AddOnType) => {
    removeAddOn(type);
  };

  const handleContinue = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header
        variant="plans"
        currentStep={3}
        totalSteps={4}
        onBack={handleBack}
        onHelpClick={() => setHelpModalOpen(true)}
      />

      {/* Trip Summary Bar */}
      <TripSummaryBar
        destination={tripSummary.destination || "Not selected"}
        startDate={tripSummary.startDate || ""}
        endDate={tripSummary.endDate || ""}
        travelers={travelersCount}
        onEdit={handleEditTrip}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-[100px]">
        {/* Title */}
        <div className="flex flex-col items-center p-6">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D] text-center">
            Want a bit more comfort for your trip? Add some extras.
          </h1>
        </div>

        {/* Add-ons List */}
        <div className="flex flex-col gap-6 px-6 items-center">
          {ADD_ONS_DATA.map((addOn) => (
            <AddOnCardV2
              key={addOn.type}
              type={addOn.type}
              title={addOn.title}
              titleSecondLine={addOn.titleSecondLine}
              price={`+${addOn.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€`}
              benefits={addOn.benefits}
              isSelected={selectedAddOnsSet.has(addOn.type)}
              onAdd={() => handleAddAddOn(addOn.type)}
              onRemove={() => handleRemoveAddOn(addOn.type)}
              className="max-w-[342px]"
            />
          ))}
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 flex items-center justify-between shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]">
        {/* Price Section */}
        <div className="flex flex-col items-start w-[118px]">
          <p className="text-sm leading-5 text-[#757575]">Total</p>
          <p className="text-xl font-bold leading-7 text-[#111B1D]">
            {formattedPrice} €
          </p>
          <button 
            type="button"
            onClick={() => setPriceBreakdownOpen(true)}
            className="text-sm font-semibold leading-6 text-[#1F1F9C] underline"
          >
            View price details
          </button>
        </div>

        {/* Continue Button */}
        <Button onClick={handleContinue} className="w-[201px]">
          Continue
        </Button>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Price Breakdown Drawer */}
      <PriceBreakdownDrawer
        isOpen={priceBreakdownOpen}
        onClose={() => setPriceBreakdownOpen(false)}
        planName={planName}
        planPrice={basePrice * travelersCount}
        planPricePerTraveler={basePrice}
        options={selectedAddOnItems}
        taxes={taxes}
        totalPrice={totalPrice}
        onEditPlan={() => {
          setPriceBreakdownOpen(false);
          router.push("/plans");
        }}
        onEditOptions={() => {
          setPriceBreakdownOpen(false);
          // Already on options page, just close
        }}
      />
    </div>
  );
}
