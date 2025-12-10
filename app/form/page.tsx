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

// Types
type TripType = "single" | "multi" | null;

interface Traveler {
  age: number | null;
}

interface FormState {
  tripType: TripType;
  needsCancellation: boolean | null;
  tripCost: number | null;
  destination: string | null;
  dates: { start: string; end: string } | null;
  travelers: Traveler[];
  hasPromoCode: boolean | null;
}

const initialState: FormState = {
  tripType: null,
  needsCancellation: null,
  tripCost: null,
  destination: null,
  dates: null,
  travelers: [{ age: null }],
  hasPromoCode: null,
};

export default function FormPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialState);

  // Modal states
  const [isDestinationPickerOpen, setIsDestinationPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Track if inputs have been validated (via debounce timeout)
  const [tripCostValidated, setTripCostValidated] = useState(false);
  const [travelerAgeValidated, setTravelerAgeValidated] = useState(false);

  // Refs for auto-scroll
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);

  // Scroll to section helper
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Debounce effect for trip cost - validates after 1 second of inactivity
  useEffect(() => {
    if (formState.tripCost !== null && formState.tripCost > 0) {
      const timer = setTimeout(() => {
        setTripCostValidated(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setTripCostValidated(false);
    }
  }, [formState.tripCost]);

  // Debounce effect for traveler age - validates after 1 second of inactivity
  useEffect(() => {
    const firstTraveler = formState.travelers[0];
    if (firstTraveler?.age !== null && firstTraveler?.age > 0) {
      const timer = setTimeout(() => {
        setTravelerAgeValidated(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setTravelerAgeValidated(false);
    }
  }, [formState.travelers]);

  // Visibility logic - buttons trigger immediately, inputs trigger after 1s debounce
  const showSection2 = formState.tripType !== null;
  const showSection3 = formState.needsCancellation === true;
  const showSection4 =
    formState.needsCancellation === false ||
    (formState.needsCancellation === true && tripCostValidated && formState.tripCost !== null && formState.tripCost > 0);
  const showSection5 = showSection4 && formState.destination !== null;
  const showSection6 = showSection5 && formState.dates !== null;
  const showSection7 =
    showSection6 &&
    travelerAgeValidated &&
    formState.travelers.length > 0 &&
    formState.travelers[0].age !== null &&
    formState.travelers[0].age > 0;

  // Form validity
  const isFormValid =
    formState.tripType !== null &&
    formState.needsCancellation !== null &&
    (formState.needsCancellation === false || (formState.tripCost !== null && formState.tripCost > 0)) &&
    formState.destination !== null &&
    formState.dates !== null &&
    formState.travelers.length > 0 &&
    formState.travelers[0].age !== null &&
    formState.travelers[0].age > 0 &&
    formState.hasPromoCode !== null;

  // Auto-scroll effects - scroll when section becomes visible
  useEffect(() => {
    if (showSection2 && formState.tripType !== null) {
      scrollToSection(section2Ref);
    }
  }, [formState.tripType, showSection2]);

  useEffect(() => {
    if (formState.needsCancellation === true) {
      scrollToSection(section3Ref);
    } else if (formState.needsCancellation === false && showSection4) {
      scrollToSection(section4Ref);
    }
  }, [formState.needsCancellation, showSection4]);

  // Scroll to destination when trip cost debounce validates section4
  useEffect(() => {
    if (showSection4 && tripCostValidated) {
      scrollToSection(section4Ref);
    }
  }, [tripCostValidated, showSection4]);

  useEffect(() => {
    if (showSection5 && formState.destination !== null) {
      scrollToSection(section5Ref);
    }
  }, [formState.destination, showSection5]);

  useEffect(() => {
    if (showSection6 && formState.dates !== null) {
      scrollToSection(section6Ref);
    }
  }, [formState.dates, showSection6]);

  // Scroll to promo code when traveler age debounce validates section7
  useEffect(() => {
    if (showSection7 && travelerAgeValidated) {
      scrollToSection(section7Ref);
    }
  }, [travelerAgeValidated, showSection7]);

  // Handlers
  const handleTripTypeSelect = (type: TripType) => {
    setFormState((prev) => ({ ...prev, tripType: type }));
  };

  const handleCancellationChange = (value: boolean) => {
    setFormState((prev) => ({
      ...prev,
      needsCancellation: value,
      tripCost: value ? prev.tripCost : null, // Reset trip cost if no cancellation needed
    }));
    // Reset validation state when cancellation changes
    setTripCostValidated(false);
  };

  const handleTripCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFormState((prev) => ({ ...prev, tripCost: value }));
  };

  const handleDestinationClick = () => {
    setIsDestinationPickerOpen(true);
  };

  const handleDestinationSelect = (destination: string) => {
    setFormState((prev) => ({ ...prev, destination }));
  };

  const handleDatesClick = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatesSelect = (dates: { start: string; end: string }) => {
    setFormState((prev) => ({ ...prev, dates }));
  };

  const handleTravelerAgeChange = (index: number, age: number | null) => {
    setFormState((prev) => {
      const newTravelers = [...prev.travelers];
      newTravelers[index] = { age };
      return { ...prev, travelers: newTravelers };
    });
  };

  const handleAddTraveler = () => {
    setFormState((prev) => ({
      ...prev,
      travelers: [...prev.travelers, { age: null }],
    }));
  };

  const handlePromoCodeChange = (value: boolean) => {
    setFormState((prev) => ({ ...prev, hasPromoCode: value }));
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
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
              formState.tripType === "single"
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
              formState.tripType === "multi"
                ? "border-[#1F1F9C] bg-[#E8F1FF] text-[#00008F]"
                : "border-[#1F1F9C] bg-white text-[#343C3D] hover:bg-[#F0F0F0]"
            )}
          >
            Annual multi-trip
          </button>
        </div>

        {/* Section 2: Trip Cancellation */}
        {showSection2 && (
          <div ref={section2Ref} className="p-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
                Do you need trip cancellation coverage?
              </h2>
              <YesNoButtons
                value={formState.needsCancellation}
                onChange={handleCancellationChange}
              />
            </div>
          </div>
        )}

        {/* Section 3: Trip Cost (conditional) */}
        {showSection3 && (
          <div ref={section3Ref} className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              What is the cost of your trip?
            </h2>

            <InputWithSuffix
              type="number"
              placeholder="e.g: 2000"
              suffix="€"
              value={formState.tripCost ?? ""}
              onChange={handleTripCostChange}
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
          <div ref={section4Ref} className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              Where are you travelling?
            </h2>

            <button
              type="button"
              onClick={handleDestinationClick}
              className="w-full h-12 px-4 py-2 rounded-lg border border-[#CCCCCC] bg-white flex items-center justify-between hover:border-[#757575] transition-colors"
            >
              <span
                className={cn(
                  "text-base leading-6",
                  formState.destination ? "text-[#1F1F9C]" : "text-[#757575]"
                )}
              >
                {formState.destination || "Select your destination"}
              </span>
              {/* Chevron down */}
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
          <div ref={section5Ref} className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              When are you travelling?
            </h2>

            <button
              type="button"
              onClick={handleDatesClick}
              className="w-full h-12 rounded-lg border border-[#757575] bg-white flex items-center overflow-hidden hover:border-[#1F1F9C] transition-colors"
            >
              {/* Calendar icon container */}
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
                    stroke={formState.dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6667 1.33333V4"
                    stroke={formState.dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33333 1.33333V4"
                    stroke={formState.dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 6.66667H14"
                    stroke={formState.dates ? "#1F1F9C" : "#343C3D"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Date text */}
              <span
                className={cn(
                  "flex-1 px-4 text-base leading-6 text-left",
                  formState.dates ? "text-[#111B1D]" : "text-[#757575]"
                )}
              >
                {formState.dates
                  ? `${formState.dates.start} - ${formState.dates.end}`
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
          <div ref={section6Ref} className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              Who&apos;s the cover for?
            </h2>

            {formState.travelers.map((traveler, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full"
              >
                <label className="text-xl font-semibold leading-7 text-[#343C3D]">
                  Traveler&apos;s Age
                </label>

                <div className="w-[153px] h-12 rounded-lg border border-[#757575] flex overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
                  <input
                    type="number"
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
              {/* Plus icon */}
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
          <div ref={section7Ref} className="pt-6 pb-20 px-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
                Do you have a promo code
              </h2>
              <YesNoButtons
                value={formState.hasPromoCode}
                onChange={handlePromoCodeChange}
              />
            </div>
          </div>
        )}

        {/* Reinsurance Block */}
        <ReinsuranceBlock />
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white px-6 py-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          fullWidth
        >
          See my plans
        </Button>
      </div>

      {/* Destination Picker Modal */}
      <DestinationPicker
        isOpen={isDestinationPickerOpen}
        onClose={() => setIsDestinationPickerOpen(false)}
        onSelect={handleDestinationSelect}
        selectedDestination={formState.destination}
      />

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDatesSelect}
        selectedDates={formState.dates}
      />
    </div>
  );
}

