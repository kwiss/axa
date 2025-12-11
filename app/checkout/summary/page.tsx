"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header, HelpModal } from "@/components/axa";
import { OrderSummaryCard } from "@/components/axa/OrderSummaryCard";
import { Lock } from "lucide-react";
import { useFunnelStore, useTripSummary } from "@/lib/store";

// Plan prices
const PLAN_PRICES: Record<string, number> = {
  basic: 32.23,
  essential: 62.23,
  premium: 86.23,
};

// Plan names
const PLAN_NAMES: Record<string, string> = {
  basic: "Basic",
  essential: "Essential",
  premium: "Premium",
};

// Add-on prices
const ADD_ON_PRICES: Record<string, { name: string; price: number }> = {
  sport: { name: "Sport insurance", price: 12.5 },
  luggages: { name: "Luggages insurance", price: 12.5 },
  "cancel-any-reason": { name: "Cancel for any reason", price: 12.5 },
  "missed-connection": { name: "Missed connection", price: 32.5 },
  electronics: { name: "Electronics & Valuables cover", price: 12.5 },
};

export default function CheckoutSummaryPage() {
  const router = useRouter();
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Use Zustand store
  const { selectedPlanId, selectedAddOns } = useFunnelStore();
  const tripSummary = useTripSummary();
  const travelersCount = tripSummary.travelers;

  const basePrice = PLAN_PRICES[selectedPlanId] || PLAN_PRICES.essential;
  const planName = PLAN_NAMES[selectedPlanId] || "Essential";

  // Calculate add-ons items
  const addOnsItems = useMemo(() => {
    return selectedAddOns.map((type) => {
      const addOn = ADD_ON_PRICES[type];
      return {
        label: addOn?.name || type,
        price: (addOn?.price || 0) * travelersCount,
        pricePerTraveler: addOn?.price || 0,
      };
    });
  }, [selectedAddOns, travelersCount]);

  // Calculate totals
  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((total, type) => {
      const addOn = ADD_ON_PRICES[type];
      return total + (addOn?.price || 0) * travelersCount;
    }, 0);
  }, [selectedAddOns, travelersCount]);

  const planTotal = basePrice * travelersCount;
  const subtotal = planTotal + addOnsTotal;
  const taxes = subtotal * 0.1;
  const totalPrice = subtotal + taxes;

  // Format price
  const formattedTotalPrice = useMemo(() => {
    return totalPrice.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [totalPrice]);

  // Handlers
  const handleBack = () => router.back();

  const handleEditTrip = () => {
    router.push("/form");
  };

  const handleEditPlan = () => {
    router.push("/plans");
  };

  const handleEditOptions = () => {
    router.push("/addons");
  };

  const handleAddPromoCode = () => {
    // TODO: Open promo code modal/drawer
    console.log("Add promo code");
  };

  const handleContinueToPayment = () => {
    router.push("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header
        variant="plans"
        currentStep={4}
        totalSteps={4}
        onBack={handleBack}
        onHelpClick={() => setHelpModalOpen(true)}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto pb-[120px]">
        {/* Title */}
        <div className="px-6 pt-6 pb-6">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D] text-center">
            Almost there! Let&apos;s review your trip details before you pay
          </h1>
        </div>

        {/* Order Summary Card */}
        <div className="px-6">
          <OrderSummaryCard
            destination={tripSummary.destination || "Not selected"}
            startDate={tripSummary.startDate || ""}
            endDate={tripSummary.endDate || ""}
            travelers={travelersCount}
            planName={planName}
            planPrice={planTotal}
            planPricePerTraveler={basePrice}
            options={addOnsItems}
            taxes={taxes}
            totalPrice={totalPrice}
            onEditTrip={handleEditTrip}
            onEditPlan={handleEditPlan}
            onEditOptions={handleEditOptions}
            onAddPromoCode={handleAddPromoCode}
          />
        </div>

        {/* Secured Payment Section */}
        <div className="px-6 pt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Lock className="size-6 text-[#111B1D]" />
            <span className="text-base font-semibold leading-4 text-[#111B1D]">
              Secured payment
            </span>
          </div>
          <p className="text-sm leading-4 text-[#111B1D] text-center">
            CB, Visa, Amex, Paypal, 3XCB, Apple Pay
          </p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]">
        <Button onClick={handleContinueToPayment} fullWidth>
          Continue and pay {formattedTotalPrice} €
        </Button>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
}
