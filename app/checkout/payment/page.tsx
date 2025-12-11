"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, TripSummaryBar, HelpModal } from "@/components/axa";
import { CreditCardDrawer } from "@/components/axa/CreditCardDrawer";
import { InstallmentDrawer } from "@/components/axa/InstallmentDrawer";
import { ChevronRight } from "lucide-react";
import { useFunnelStore, useTripSummary } from "@/lib/store";

// Plan prices
const PLAN_PRICES: Record<string, number> = {
  basic: 32.23,
  essential: 62.23,
  premium: 86.23,
};

// Add-on prices
const ADD_ON_PRICES: Record<string, { name: string; price: number }> = {
  sport: { name: "Sport insurance", price: 12.5 },
  luggages: { name: "Luggages insurance", price: 12.5 },
  "cancel-any-reason": { name: "Cancel for any reason", price: 12.5 },
  "missed-connection": { name: "Missed connection", price: 32.5 },
  electronics: { name: "Electronics & Valuables cover", price: 12.5 },
};

// Payment card icons
function VisaIcon() {
  return (
    <div className="h-8 w-[46px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center">
      <svg viewBox="0 0 48 16" className="h-3 w-auto">
        <text x="4" y="13" fill="#1A1F71" fontFamily="Arial" fontWeight="bold" fontSize="14">VISA</text>
      </svg>
    </div>
  );
}

function AmexIcon() {
  return (
    <div className="h-8 w-[46px] rounded-md border border-[#D9D9D9] bg-[#1F72CD] flex items-center justify-center">
      <span className="text-[8px] font-bold text-white">AMEX</span>
    </div>
  );
}

function DiscoverIcon() {
  return (
    <div className="h-8 w-[46px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center">
      <span className="text-[6px] font-bold text-[#FF6000]">DISCOVER</span>
    </div>
  );
}

function MastercardIcon() {
  return (
    <div className="h-8 w-[47px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center">
      <svg viewBox="0 0 32 20" className="h-5 w-auto">
        <circle cx="11" cy="10" r="7" fill="#EB001B" />
        <circle cx="21" cy="10" r="7" fill="#F79E1B" />
        <path d="M16 4.5a7 7 0 0 0 0 11 7 7 0 0 0 0-11z" fill="#FF5F00" />
      </svg>
    </div>
  );
}

// PayPal Logo
function PayPalLogo() {
  return (
    <svg viewBox="0 0 100 24" className="h-6 w-auto">
      <text x="0" y="18" fill="#003087" fontFamily="Arial" fontWeight="bold" fontSize="16">Pay</text>
      <text x="30" y="18" fill="#009CDE" fontFamily="Arial" fontWeight="bold" fontSize="16">Pal</text>
    </svg>
  );
}

// Bizum Logo
function BizumLogo() {
  return (
    <div className="flex items-center">
      <svg viewBox="0 0 60 24" className="h-[42px] w-auto">
        <text x="0" y="18" fill="#05C3DD" fontFamily="Arial" fontWeight="bold" fontSize="14">bizum</text>
      </svg>
    </div>
  );
}

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [creditCardDrawerOpen, setCreditCardDrawerOpen] = useState(false);
  const [installmentDrawerOpen, setInstallmentDrawerOpen] = useState(false);

  // Use Zustand store
  const { selectedPlanId, selectedAddOns } = useFunnelStore();
  const tripSummary = useTripSummary();
  const travelersCount = tripSummary.travelers;

  const basePrice = PLAN_PRICES[selectedPlanId] || PLAN_PRICES.essential;

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

  // Handlers
  const handleBack = () => router.back();
  const handleEditTrip = () => router.push("/form");

  const handlePayPal = () => {
    // For demo, just show an alert
    alert("PayPal payment would be initiated here");
  };

  const handleApplePay = () => {
    // For demo, just show an alert
    alert("Apple Pay payment would be initiated here");
  };

  const handleGooglePay = () => {
    // For demo, just show an alert
    alert("Google Pay payment would be initiated here");
  };

  const handleBizum = () => {
    // For demo, just show an alert
    alert("Bizum payment would be initiated here");
  };

  const handlePaymentSuccess = () => {
    // Close drawers and redirect to confirmation
    setCreditCardDrawerOpen(false);
    setInstallmentDrawerOpen(false);
    router.push("/confirmation");
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

      {/* Trip Summary Bar */}
      <TripSummaryBar
        destination={tripSummary.destination || "Not selected"}
        startDate={tripSummary.startDate || ""}
        endDate={tripSummary.endDate || ""}
        travelers={travelersCount}
        onEdit={handleEditTrip}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* Quick Payments Section */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D] text-center mb-6">
            Choose your payment method
          </h1>

          <div className="flex flex-col gap-4">
            {/* PayPal Button */}
            <button
              type="button"
              onClick={handlePayPal}
              className="w-full h-[50px] rounded-lg bg-[#FFC43A] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-base text-[#3C4043]">Buy with</span>
              <PayPalLogo />
            </button>

            {/* Apple Pay Button */}
            <button
              type="button"
              onClick={handleApplePay}
              className="w-full h-[50px] rounded-lg bg-black flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
            >
              <span className="text-base text-white">Buy with</span>
              <span className="text-[23px] font-semibold text-white tracking-tight"></span>
              <span className="text-[23px] font-semibold text-white tracking-tight">Pay</span>
            </button>

            {/* Google Pay Button */}
            <button
              type="button"
              onClick={handleGooglePay}
              className="w-full h-[50px] rounded-lg bg-white border border-[#3C4043] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base text-[#3C4043]">Buy with</span>
              <span className="text-base font-medium">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-base font-medium text-[#5F6368]">Pay</span>
            </button>
          </div>
        </div>

        {/* Credit Card Payments Section */}
        <div className="bg-[#FAFAFA] px-6 py-8">
          {/* Card Icons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <VisaIcon />
            <AmexIcon />
            <DiscoverIcon />
            <MastercardIcon />
          </div>

          {/* Payment Options List */}
          <div className="flex flex-col">
            {/* Pay with Credit Card */}
            <button
              type="button"
              onClick={() => setCreditCardDrawerOpen(true)}
              className="w-full bg-white border border-[#757575] rounded-t-lg px-4 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-semibold leading-6 text-[#111B1D]">
                Pay with Credit Card
              </span>
              <ChevronRight className="size-6 text-[#343C3D]" />
            </button>

            {/* Pay in 3, 6 or 9 Times */}
            <button
              type="button"
              onClick={() => setInstallmentDrawerOpen(true)}
              className="w-full bg-white border-x border-b border-[#757575] px-4 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-semibold leading-6 text-[#111B1D]">
                Pay in 3, 6 or 9 Times by Credit Card
              </span>
              <ChevronRight className="size-6 text-[#343C3D]" />
            </button>

            {/* Pay with Bizum */}
            <button
              type="button"
              onClick={handleBizum}
              className="w-full bg-white border-x border-b border-[#757575] rounded-b-lg px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-base font-semibold leading-6 text-[#111B1D]">
                  Pay with
                </span>
                <BizumLogo />
              </div>
              <ChevronRight className="size-6 text-[#343C3D]" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Credit Card Drawer */}
      <CreditCardDrawer
        isOpen={creditCardDrawerOpen}
        onClose={() => setCreditCardDrawerOpen(false)}
        totalPrice={totalPrice}
        onPay={handlePaymentSuccess}
      />

      {/* Installment Drawer */}
      <InstallmentDrawer
        isOpen={installmentDrawerOpen}
        onClose={() => setInstallmentDrawerOpen(false)}
        totalPrice={totalPrice}
        onPay={handlePaymentSuccess}
      />
    </div>
  );
}
