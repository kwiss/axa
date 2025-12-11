"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormHeader,
  YesNoButtons,
  InputWithSuffix,
  InfoTooltip,
  ReinsuranceBlock,
  DestinationPicker,
  DateRangePicker,
} from "@/components/axa";
import { useFunnelStore, type InsuranceType } from "@/lib/store";
import { Check } from "lucide-react";

export default function FormPage() {
  const router = useRouter();
  
  // Use Zustand store
  const {
    insuranceType,
    setInsuranceType,
    needsCancellation,
    setNeedsCancellation,
    tripCost,
    setTripCost,
    destination,
    setDestination,
    dates,
    setDates,
    travelers,
    updateTraveler,
    addTraveler,
    hasPromoCode,
    setHasPromoCode,
    promoCode,
    setPromoCode,
  } = useFunnelStore();

  // Modal states
  const [isDestinationPickerOpen, setIsDestinationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Track if this is a "back navigation" (data already exists on mount)
  // null = not yet determined, true = back nav (don't scroll), false = fresh visit (scroll OK)
  const isBackNavigation = useRef<boolean | null>(null);
  const hasCheckedBackNav = useRef(false);

  // Validation states - triggered by blur or Enter (no more timeouts!)
  // Start as false - will be set by back navigation detection if data exists
  const [tripCostValidated, setTripCostValidated] = useState(false);
  const [travelerAgeValidated, setTravelerAgeValidated] = useState(false);
  
  // Detect back navigation after Zustand hydration
  // This effect runs when insuranceType changes (including after hydration from localStorage)
  useEffect(() => {
    if (!hasCheckedBackNav.current && insuranceType !== null) {
      // Data already exists = back navigation
      hasCheckedBackNav.current = true;
      isBackNavigation.current = true;
      
      // Set validation states based on existing data (for back navigation)
      if (tripCost !== null && tripCost > 0) {
        setTripCostValidated(true);
      }
      if (travelers.length > 0 && travelers[0]?.age !== null && travelers[0]?.age > 0) {
        setTravelerAgeValidated(true);
      }
      
      // Scroll to top since user is coming back to edit
      window.scrollTo({ top: 0, behavior: "instant" });
      // After a short delay, allow future interactions to trigger scrolls
      setTimeout(() => {
        isBackNavigation.current = false;
      }, 500);
    } else if (!hasCheckedBackNav.current && insuranceType === null) {
      // First check and no data = fresh visit
      hasCheckedBackNav.current = true;
      isBackNavigation.current = false;
    }
  }, [insuranceType, tripCost, travelers]);

  // Refs for auto-scroll
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);

  // Refs for inputs and buttons
  const tripCostRef = useRef<HTMLInputElement>(null);
  const destinationButtonRef = useRef<HTMLButtonElement>(null);
  const datesButtonRef = useRef<HTMLButtonElement>(null);
  const travelerAgeRef = useRef<HTMLInputElement>(null);

  // Scroll to section helper - uses scrollIntoView with scroll-margin-top on elements
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Visibility logic - buttons trigger immediately, inputs trigger on blur/Enter
  const showSection2 = insuranceType !== null;
  const showSection3 = needsCancellation === true;
  const showSection4 =
    needsCancellation === false ||
    (needsCancellation === true &&
      tripCostValidated &&
      tripCost !== null &&
      tripCost > 0);
  const showSection5 = showSection4 && destination !== null;
  const showSection6 = showSection5 && dates !== null;
  const showSection7 =
    showSection6 &&
    travelerAgeValidated &&
    travelers.length > 0 &&
    travelers[0]?.age !== null &&
    travelers[0]?.age > 0;

  // Form validity
  const isFormValid =
    insuranceType !== null &&
    needsCancellation !== null &&
    (needsCancellation === false ||
      (tripCost !== null && tripCost > 0)) &&
    destination !== null &&
    dates !== null &&
    travelers.length > 0 &&
    travelers[0]?.age !== null &&
    travelers[0]?.age > 0 &&
    hasPromoCode !== null;

  // Auto-scroll effects - scroll when section becomes visible
  // Only scroll if NOT a back navigation (first time filling the form)
  // Also skip if not yet determined (null)
  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (showSection2 && insuranceType !== null) {
      scrollToSection(section2Ref);
    }
  }, [insuranceType, showSection2]);

  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (needsCancellation === true) {
      scrollToSection(section3Ref);
      // Focus trip cost input (with delay to let scroll finish)
      setTimeout(() => tripCostRef.current?.focus({ preventScroll: true }), 250);
    } else if (needsCancellation === false && showSection4) {
      scrollToSection(section4Ref);
    }
  }, [needsCancellation, showSection4]);

  // Scroll to destination when trip cost is validated
  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (showSection4 && tripCostValidated) {
      scrollToSection(section4Ref);
      setTimeout(() => destinationButtonRef.current?.focus({ preventScroll: true }), 250);
    }
  }, [tripCostValidated, showSection4]);

  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (showSection5 && destination !== null) {
      scrollToSection(section5Ref);
      setTimeout(() => datesButtonRef.current?.focus({ preventScroll: true }), 250);
    }
  }, [destination, showSection5]);

  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (showSection6 && dates !== null) {
      scrollToSection(section6Ref);
      // Focus traveler age input (with delay to let scroll finish)
      setTimeout(() => travelerAgeRef.current?.focus({ preventScroll: true }), 250);
    }
  }, [dates, showSection6]);

  // Scroll to promo code when traveler age is validated
  useEffect(() => {
    if (isBackNavigation.current !== false) return;
    if (showSection7 && travelerAgeValidated) {
      scrollToSection(section7Ref);
    }
  }, [travelerAgeValidated, showSection7]);

  // Handlers
  const handleTripTypeSelect = (type: InsuranceType) => {
    setInsuranceType(type);
  };

  const handleCancellationChange = (value: boolean) => {
    setNeedsCancellation(value);
    setTripCostValidated(false);
  };

  const handleTripCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setTripCost(value);
  };

  const handleTripCostValidate = () => {
    if (tripCost !== null && tripCost > 0) {
      setTripCostValidated(true);
    }
  };

  const handleTripCostKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTripCostValidate();
      tripCostRef.current?.blur();
    }
  };

  const handleDestinationClick = () => {
    setIsDestinationPickerOpen(true);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
  };

  const handleDatesClick = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatesSelect = (newDates: { start: string; end: string }) => {
    setDates(newDates);
  };

  const handleTravelerAgeChange = (index: number, age: number | null) => {
    updateTraveler(index, { age });
  };

  const handleTravelerAgeValidate = () => {
    const firstTraveler = travelers[0];
    if (firstTraveler?.age !== null && firstTraveler?.age > 0) {
      setTravelerAgeValidated(true);
    }
  };

  const handleTravelerAgeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTravelerAgeValidate();
      travelerAgeRef.current?.blur();
    }
  };

  const handleAddTraveler = () => {
    addTraveler();
  };

  const handlePromoCodeChange = (value: boolean) => {
    setHasPromoCode(value);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      router.push("/plans");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <FormHeader currentStep={1} totalSteps={4} onBack={handleBack} />

      {/* Content */}
      <div className="flex-1">
        {/* Intro Section */}
        <div className="p-6">
          <p className="text-base font-semibold leading-6 text-[#111B1D]">
            Almost there!
            <br />
            Just two quick questions to tailor your plan to your travel style
          </p>
        </div>

        {/* Section 1: Trip Type */}
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
            What type of travel insurance do you need?
          </h2>

          <button
            type="button"
            onClick={() => handleTripTypeSelect("single")}
            className={cn(
              "w-full h-12 px-6 rounded-lg border text-sm font-semibold uppercase tracking-[1px] transition-all flex items-center justify-center outline-none focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]",
              insuranceType === "single"
                ? "border-[#1F1F9C] bg-[#E8F1FF] text-[#00008F]"
                : "border-[#343C3D] bg-white text-[#343C3D] hover:bg-[#F0F0F0]"
            )}
          >
            A single trip
          </button>

          <button
            type="button"
            onClick={() => handleTripTypeSelect("multi")}
            className={cn(
              "w-full h-12 px-6 rounded-lg border text-sm font-semibold uppercase tracking-[1px] transition-all flex items-center justify-center outline-none focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]",
              insuranceType === "multi"
                ? "border-[#1F1F9C] bg-[#E8F1FF] text-[#00008F]"
                : "border-[#1F1F9C] bg-white text-[#343C3D] hover:bg-[#F0F0F0]"
            )}
          >
            Annual multi-trip
          </button>
        </div>

        {/* Section 2: Trip Cancellation */}
        {showSection2 && (
          <div ref={section2Ref} className="p-6 scroll-mt-[100px]">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
                Do you need trip cancellation coverage?
              </h2>
              <YesNoButtons
                value={needsCancellation}
                onChange={handleCancellationChange}
              />
            </div>
          </div>
        )}

        {/* Section 3: Trip Cost (conditional) */}
        {showSection3 && (
          <div ref={section3Ref} className="p-6 flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              What is the cost of your trip?
            </h2>

            <InputWithSuffix
              ref={tripCostRef}
              type="number"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder="e.g: 2000"
              suffix="€"
              value={tripCost ?? ""}
              onChange={handleTripCostChange}
              onBlur={handleTripCostValidate}
              onKeyDown={handleTripCostKeyDown}
              min={0}
            />

            <InfoTooltip>
              If your trip is cancelled for a covered reason, this amount helps us
              refund your prepaid expenses up to the insured limit
            </InfoTooltip>
          </div>
        )}

        {/* Section 4: Destination */}
        {showSection4 && (
          <div ref={section4Ref} className="p-6 flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              Where are you travelling?
            </h2>

            <button
              ref={destinationButtonRef}
              type="button"
              onClick={handleDestinationClick}
              className="w-full h-12 px-4 py-2 rounded-lg border border-[#CCCCCC] bg-white flex items-center justify-between hover:border-[#757575] transition-colors outline-none focus-visible:border-[#1F1F9C] focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
            >
              <span
                className={cn(
                  "text-base leading-6",
                  destination ? "text-[#1F1F9C]" : "text-[#757575]"
                )}
              >
                {destination || "Select your destination"}
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#343C3D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <InfoTooltip>
              Please note that the policyholder and the insured must be Spanish
              residents domiciled in Spain, and that the trip must originate from
              Spain.
            </InfoTooltip>
          </div>
        )}

        {/* Section 5: Dates */}
        {showSection5 && (
          <div ref={section5Ref} className="p-6 flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              When are you travelling?
            </h2>

            <button
              ref={datesButtonRef}
              type="button"
              onClick={handleDatesClick}
              className="w-full h-12 rounded-lg border border-[#757575] bg-white flex items-center overflow-hidden hover:border-[#1F1F9C] transition-colors outline-none focus-visible:border-[#1F1F9C] focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
            >
              <div className="h-full px-4 flex items-center bg-[rgba(142,187,255,0.2)] border-r border-[#757575]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
                    stroke={dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6667 1.33333V4"
                    stroke={dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33333 1.33333V4"
                    stroke={dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 6.66667H14"
                    stroke={dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className={cn(
                  "flex-1 px-4 text-base leading-6 text-left",
                  dates ? "text-[#111B1D]" : "text-[#757575]"
                )}
              >
                {dates
                  ? `${dates.start} - ${dates.end}`
                  : "Select Start date and End date"}
              </span>
            </button>

            <InfoTooltip>
              Important: Coverage applies only if the policy is purchased at least
              48 hours prior to departure.
            </InfoTooltip>
          </div>
        )}

        {/* Section 6: Travelers */}
        {showSection6 && (
          <div ref={section6Ref} className="p-6 flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              Who&apos;s the cover for?
            </h2>

            {travelers.map((traveler, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full"
              >
                <label className="text-xl font-semibold leading-7 text-[#343C3D]">
                  Traveler&apos;s Age
                </label>

                <div className="w-[153px] h-12 rounded-lg border border-[#757575] flex overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
                  <input
                    ref={index === 0 ? travelerAgeRef : undefined}
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="done"
                    min={0}
                    max={120}
                    placeholder=""
                    value={traveler.age ?? ""}
                    onChange={(e) =>
                      handleTravelerAgeChange(
                        index,
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                    onBlur={index === 0 ? handleTravelerAgeValidate : undefined}
                    onKeyDown={index === 0 ? handleTravelerAgeKeyDown : undefined}
                    className="flex-1 px-4 py-3 text-base leading-6 text-[#343C3D] bg-white outline-none placeholder:text-[#757575] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="px-4 flex items-center bg-[rgba(142,187,255,0.2)] border-l border-[#757575]">
                    <span className="text-sm font-semibold uppercase tracking-[1px] text-[#1F1F9C]">
                      Years
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add traveler link */}
            <button
              type="button"
              onClick={handleAddTraveler}
              className="flex items-center gap-2 text-[#00008F]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.33333V12.6667"
                  stroke="#00008F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33333 8H12.6667"
                  stroke="#00008F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-[1px]">
                Add traveler
              </span>
            </button>
          </div>
        )}

        {/* Section 7: Promo Code */}
        {showSection7 && (
          <div ref={section7Ref} className="pt-6 pb-20 px-6 scroll-mt-[100px]">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
                Do you have a promo code
              </h2>
              <YesNoButtons
                value={hasPromoCode}
                onChange={handlePromoCodeChange}
              />
              {hasPromoCode === true && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#343C3D]">
                    Promo code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className={cn(
                        "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575] uppercase",
                        "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                      )}
                    />
                    {promoCode && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reinsurance Block */}
        <ReinsuranceBlock className="mt-24" />
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white px-6 py-4">
        <Button onClick={handleSubmit} disabled={!isFormValid} fullWidth>
          See my plans
        </Button>
      </div>

      {/* Destination Picker Modal */}
      <DestinationPicker
        isOpen={isDestinationPickerOpen}
        onClose={() => setIsDestinationPickerOpen(false)}
        onSelect={handleDestinationSelect}
        selectedDestination={destination}
      />

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDatesSelect}
        selectedDates={dates}
      />
    </div>
  );
}
