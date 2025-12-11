"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Header,
  TripSummaryBar,
  PlanCarousel,
  CoverageItem,
  CoverageList,
  CoverageDetailDrawer,
  HelpModal,
  SaveQuoteDrawer,
} from "@/components/axa";
import type { Plan } from "@/components/axa/PlanCarousel";
import type { Coverage } from "@/components/axa/CoverageList";
import type { CoverageDetail } from "@/components/axa/CoverageDetailDrawer";
import { useFunnelStore, useTripSummary, type PlanId } from "@/lib/store";

// Plans data with coverages
const PLANS_DATA: (Plan & { coverages: Coverage[] })[] = [
  {
    id: "basic",
    name: "Basic",
    price: 32.23,
    isRecommended: false,
    coverages: [
      { id: "trip-interruption", label: "Trip Interruption", amount: "2,500 €", included: true },
      { id: "medical-expenses", label: "Emmergency Medical Expenses", amount: "100,000 €", included: true },
      { id: "evacuation", label: "Emergency Evacuation", amount: "250,000 €", included: true },
      { id: "political-evacuation", label: "Political and Natural Disaster Evacuation", amount: "150,000 €", included: false },
      { id: "trip-delay", label: "Trip Delay", included: false },
    ],
  },
  {
    id: "essential",
    name: "Essential",
    price: 62.23,
    isRecommended: true,
    coverages: [
      { id: "trip-interruption", label: "Trip Interruption", amount: "2,500 €", included: true },
      { id: "medical-expenses", label: "Emmergency Medical Expenses", amount: "100,000 €", included: true },
      { id: "evacuation", label: "Emergency Evacuation", amount: "250,000 €", included: true },
      { id: "political-evacuation", label: "Political and Natural Disaster Evacuation", amount: "150,000 €", included: true },
      { id: "trip-delay", label: "Trip Delay", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 86.23,
    isRecommended: false,
    coverages: [
      { id: "trip-interruption", label: "Trip Interruption", amount: "2,500 €", included: true },
      { id: "medical-expenses", label: "Emmergency Medical Expenses", amount: "100,000 €", included: true },
      { id: "evacuation", label: "Emergency Evacuation", amount: "250,000 €", included: true },
      { id: "political-evacuation", label: "Political and Natural Disaster Evacuation", amount: "150,000 €", included: true },
      { id: "trip-delay", label: "Trip Delay", included: true },
    ],
  },
];

// Extended coverage data for the expanded view
const EXTENDED_COVERAGES = {
  included: [
    { id: "trip-duration", label: "Trip Duration", description: "Up to 150% of the trip cost", expandable: true, included: true },
    { id: "medical-expenses", label: "Medical Expenses and Care", description: "Up to 150% of the trip cost", expandable: true, included: true },
    { id: "medical-assistance", label: "Medical Assistance, Repatriation", description: "Up to 100,000 €", expandable: true, included: true },
    { id: "travel-assistance", label: "Travel Assistance", expandable: true, included: true },
    { id: "compensation", label: "Compensation and Damages", expandable: true, included: true },
  ],
  excluded: [
    { id: "luggage", label: "Luggage", description: "Reimburse you for lost, stolen, or damaged belonging", expandable: true, included: false },
    { id: "trip-cancellation", label: "Trip cancellation", expandable: true, included: false },
    { id: "sport", label: "Sport insurance", expandable: true, included: false },
    { id: "travel-assistance-ex", label: "Travel Assistance", expandable: true, included: false },
    { id: "compensation-ex", label: "Compensation and Damages", expandable: true, included: false },
  ],
};

// Coverage detail information for drawers
interface CoverageDetailInfo {
  title: string;
  description: string;
  details: CoverageDetail[];
}

const COVERAGE_DETAILS: Record<string, CoverageDetailInfo> = {
  "luggage": {
    title: "Luggage",
    description: "Reimburse you for lost, stolen, or damaged belonging",
    details: [
      { label: "Reimbursement for lost or stolen bags", amount: "up to 500 €" },
      { label: "Coverage for damaged belongings", amount: "up to 500 €" },
      { label: "Delay compensation", amount: "500 €" },
    ],
  },
  "trip-duration": {
    title: "Trip Duration",
    description: "Coverage for the duration of your trip",
    details: [
      { label: "Trip interruption coverage", amount: "up to 150% of trip cost" },
      { label: "Extended stay coverage", amount: "up to 14 days" },
    ],
  },
  "medical-expenses": {
    title: "Medical Expenses and Care",
    description: "Coverage for medical emergencies during your trip",
    details: [
      { label: "Emergency medical treatment", amount: "up to 100,000 €" },
      { label: "Hospital accommodation", amount: "up to 500 €/day" },
      { label: "Prescription medication", amount: "up to 1,000 €" },
    ],
  },
  "medical-assistance": {
    title: "Medical Assistance, Repatriation",
    description: "Assistance and repatriation in case of medical emergency",
    details: [
      { label: "Medical repatriation", amount: "up to 100,000 €" },
      { label: "Family member travel", amount: "included" },
      { label: "24/7 medical hotline", amount: "included" },
    ],
  },
  "travel-assistance": {
    title: "Travel Assistance",
    description: "24/7 assistance during your travels",
    details: [
      { label: "Lost document assistance", amount: "included" },
      { label: "Legal assistance", amount: "up to 5,000 €" },
      { label: "Emergency cash advance", amount: "up to 1,000 €" },
    ],
  },
  "compensation": {
    title: "Compensation and Damages",
    description: "Coverage for damages and liability",
    details: [
      { label: "Personal liability", amount: "up to 50,000 €" },
      { label: "Rental vehicle excess", amount: "up to 2,000 €" },
    ],
  },
  "trip-cancellation": {
    title: "Trip Cancellation",
    description: "Coverage if you need to cancel your trip",
    details: [
      { label: "Trip cancellation reimbursement", amount: "up to 100% of trip cost" },
      { label: "Travel supplier bankruptcy", amount: "included" },
    ],
  },
  "sport": {
    title: "Sport Insurance",
    description: "Coverage for sporting activities",
    details: [
      { label: "Winter sports coverage", amount: "included" },
      { label: "Equipment rental coverage", amount: "up to 500 €" },
      { label: "Ski pass reimbursement", amount: "up to 200 €" },
    ],
  },
};

export default function PlansPage() {
  const router = useRouter();
  
  // Use Zustand store
  const { selectedPlanId, setSelectedPlanId } = useFunnelStore();
  const tripSummary = useTripSummary();
  const travelersCount = tripSummary.travelers;
  
  const [showAllCoverages, setShowAllCoverages] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [selectedCoverageId, setSelectedCoverageId] = useState<string | null>(null);
  const [saveQuoteOpen, setSaveQuoteOpen] = useState(false);

  const selectedPlan = PLANS_DATA.find((p) => p.id === selectedPlanId) || PLANS_DATA[1];
  const selectedCoverageDetail = selectedCoverageId ? COVERAGE_DETAILS[selectedCoverageId] : null;

  // Format price with European format
  const formattedPrice = selectedPlan.price.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const formattedPriceShort = selectedPlan.price.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleBack = () => {
    router.back();
  };

  const handleEditTrip = () => {
    router.push("/form");
  };

  const handleChoosePlan = () => {
    router.push("/addons");
  };
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId as PlanId);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col">
      {/* Header */}
      <Header
        variant="plans"
        currentStep={2}
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
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D] text-center">
            Choose your plan
          </h1>
        </div>

        {/* Plan Carousel */}
        <PlanCarousel
          plans={PLANS_DATA}
          selectedPlanId={selectedPlanId}
          onSelectPlan={handleSelectPlan}
          options={{ align: "center", containScroll: false }}
        />

        {/* Plan Details Section */}
        <div className="bg-white px-6 pt-6 pb-8">
          {/* Price Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col text-[#111B1D]">
              <p className="text-xl font-semibold leading-7">
                {selectedPlan.name}
              </p>
              <p className="text-2xl font-bold leading-8">
                {formattedPrice} €
              </p>
              <p className="text-sm leading-4">
                Pay in X3 without fees
              </p>
            </div>

            {/* Email Quote Button */}
            <button
              type="button"
              onClick={() => setSaveQuoteOpen(true)}
              className="size-[42px] rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
              aria-label="Email quote"
            >
              <Mail className="size-5 text-[#1F1F9C]" />
            </button>
          </div>

          {/* Divider - only show when not expanded */}
          {!showAllCoverages && <div className="h-px bg-[#E5E5E5] mb-6" />}

          {/* Coverage Summary */}
          {!showAllCoverages && (
            <div className="flex flex-col gap-3">
              {selectedPlan.coverages.map((coverage) => (
                <CoverageItem
                  key={coverage.id}
                  id={coverage.id}
                  label={coverage.label}
                  amount={coverage.amount}
                  included={coverage.included}
                />
              ))}
            </div>
          )}

          {/* Expanded Coverage List */}
          <CoverageList
            includedItems={EXTENDED_COVERAGES.included}
            excludedItems={EXTENDED_COVERAGES.excluded}
            expanded={showAllCoverages}
            onItemClick={(coverageId) => setSelectedCoverageId(coverageId)}
          />

          {/* View All Coverages Link */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowAllCoverages(!showAllCoverages)}
              className="w-full py-4 text-sm font-semibold uppercase tracking-[1px] text-[#1F1F9C] text-center hover:underline"
            >
              {showAllCoverages ? "View less coverages" : "View all coverages"}
            </button>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]">
        <Button onClick={handleChoosePlan} fullWidth>
          Choose {selectedPlan.name} {formattedPriceShort}€
        </Button>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Coverage Detail Drawer */}
      {selectedCoverageDetail && (
        <CoverageDetailDrawer
          isOpen={!!selectedCoverageId}
          onClose={() => setSelectedCoverageId(null)}
          title={selectedCoverageDetail.title}
          description={selectedCoverageDetail.description}
          details={selectedCoverageDetail.details}
        />
      )}

      {/* Save Quote Drawer */}
      <SaveQuoteDrawer
        isOpen={saveQuoteOpen}
        onClose={() => setSaveQuoteOpen(false)}
      />
    </div>
  );
}
