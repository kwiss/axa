"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Header,
  TripSummaryBar,
  YesNoButtons,
  InfoTooltip,
  HelpModal,
  PriceBreakdownDrawer,
} from "@/components/axa";
import { Check } from "lucide-react";
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

// Types
interface TravelerData {
  name: string;
  firstName: string;
  birthDate: string;
  isPolicyholder?: boolean;
}

interface PolicyholderData {
  address: string;
  city: string;
  postcode: string;
  phoneNumber: string;
  email: string;
}

interface FormState {
  isPolicyholderTraveler: boolean | null;
  travelers: TravelerData[];
  policyholder: PolicyholderData;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDate = (date: string): boolean => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = date.match(dateRegex);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;

  return true;
};

const isValidPhone = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

const isValidPostcode = (postcode: string): boolean => {
  return postcode.trim().length >= 3;
};

const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Format date as DD/MM/YYYY while typing
const formatDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }
};

// Format phone number while typing
const formatPhoneInput = (value: string): string => {
  const startsWithPlus = value.startsWith("+");
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return startsWithPlus ? "+" : "";

  let formatted = startsWithPlus ? "+" : "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 2 === 0 && i < 12) {
      formatted += " ";
    }
    formatted += digits[i];
  }
  return formatted;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  // Use Zustand store
  const {
    selectedPlanId,
    selectedAddOns,
    travelers,
    updateTraveler,
    isPolicyholderTraveler,
    setIsPolicyholderTraveler,
    policyholder,
    setPolicyholder,
    acceptTerms,
    setAcceptTerms,
    acceptPrivacy,
    setAcceptPrivacy,
    acceptMarketing,
    setAcceptMarketing,
  } = useFunnelStore();
  const tripSummary = useTripSummary();
  const travelersCount = tripSummary.travelers;

  // Local form state initialized from store values (for checkout-specific data)
  const [localTravelers, setLocalTravelers] = useState<TravelerData[]>(() =>
    travelers.map((t, i) => ({
      name: t.name || "",
      firstName: t.firstName || "",
      birthDate: t.birthDate || "",
      isPolicyholder: i === 0,
    }))
  );
  
  const [localPolicyholder, setLocalPolicyholder] = useState<PolicyholderData>({
    address: policyholder.address,
    city: policyholder.city,
    postcode: policyholder.postcode,
    phoneNumber: policyholder.phoneNumber,
    email: policyholder.email,
  });
  
  // Form state uses store values directly where possible
  const formState: FormState = {
    isPolicyholderTraveler,
    travelers: localTravelers,
    policyholder: localPolicyholder,
    acceptTerms,
    acceptPrivacy,
    acceptMarketing,
  };

  const basePrice = PLAN_PRICES[selectedPlanId] || PLAN_PRICES.essential;
  const planName = PLAN_NAMES[selectedPlanId] || "Essential";

  // Calculate add-ons total and items
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

  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((total, type) => {
      const addOn = ADD_ON_PRICES[type];
      return total + (addOn?.price || 0);
    }, 0);
  }, [selectedAddOns]);

  const subtotal = basePrice + addOnsTotal;
  const taxes = subtotal * 0.1;
  const totalPrice = subtotal + taxes;

  // Validation states for each section
  const [traveler1Validated, setTraveler1Validated] = useState(false);
  const [contactInfoValidated, setContactInfoValidated] = useState(false);
  const [additionalTravelersValidated, setAdditionalTravelersValidated] = useState<boolean[]>(
    Array.from({ length: Math.max(0, travelersCount - 1) }, () => false)
  );

  // Error states
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Section refs
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const additionalTravelerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const legalSectionRef = useRef<HTMLDivElement>(null);

  // Input refs for focus management
  const traveler1NameRef = useRef<HTMLInputElement>(null);
  const traveler1FirstNameRef = useRef<HTMLInputElement>(null);
  const traveler1BirthDateRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const additionalTravelerNameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const additionalTravelerFirstNameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const additionalTravelerBirthDateRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Scroll helper - uses scrollIntoView which works with overflow containers
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Scroll to element (for dynamic refs)
  const scrollToElement = (element: HTMLElement | null) => {
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Visibility logic
  const showSection2 = formState.isPolicyholderTraveler !== null;
  const showSection3 = showSection2 && traveler1Validated;

  // Check if all additional travelers are validated
  const allAdditionalTravelersValidated =
    travelersCount <= 1 || additionalTravelersValidated.every((v) => v);
  const showLegalSection = showSection3 && contactInfoValidated && allAdditionalTravelersValidated;

  // Auto-scroll and focus (preventScroll to avoid browser auto-scroll override)
  useEffect(() => {
    if (showSection2) {
      scrollToSection(section2Ref);
      setTimeout(() => traveler1NameRef.current?.focus({ preventScroll: true }), 200);
    }
  }, [showSection2]);

  useEffect(() => {
    if (showSection3 && !contactInfoValidated) {
      scrollToSection(section3Ref);
      setTimeout(() => addressRef.current?.focus({ preventScroll: true }), 200);
    }
  }, [showSection3, contactInfoValidated]);

  useEffect(() => {
    if (showLegalSection) {
      setTimeout(() => {
        scrollToElement(legalSectionRef.current);
      }, 100);
    }
  }, [showLegalSection]);

  // Format price
  const formattedPrice = useMemo(() => {
    return totalPrice.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [totalPrice]);

  // Form validity
  const isFormValid =
    formState.isPolicyholderTraveler !== null &&
    traveler1Validated &&
    contactInfoValidated &&
    allAdditionalTravelersValidated &&
    formState.acceptTerms &&
    formState.acceptPrivacy;

  // Handlers
  const handleBack = () => router.back();
  const handleEditTrip = () => router.push("/form");

  const handlePolicyholderChange = (value: boolean) => {
    setIsPolicyholderTraveler(value);
  };

  const handleTravelerChange = (index: number, field: keyof TravelerData, value: string) => {
    const formattedValue = field === "birthDate" ? formatDateInput(value) : value;

    setLocalTravelers((prev) => {
      const newTravelers = [...prev];
      newTravelers[index] = { ...newTravelers[index], [field]: formattedValue };
      return newTravelers;
    });
    
    // Also update the store
    updateTraveler(index, { [field]: formattedValue });

    // Clear error
    const errorKey = `traveler${index + 1}_${field}`;
    setErrors((prev) => ({ ...prev, [errorKey]: null }));
  };

  const handlePolicyholderDataChange = (field: keyof PolicyholderData, value: string) => {
    const formattedValue = field === "phoneNumber" ? formatPhoneInput(value) : value;

    setLocalPolicyholder((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
    
    // Also update the store
    setPolicyholder({ [field]: formattedValue });

    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleCheckboxChange = (field: "acceptTerms" | "acceptPrivacy" | "acceptMarketing") => {
    // Update the store directly
    if (field === "acceptTerms") setAcceptTerms(!acceptTerms);
    if (field === "acceptPrivacy") setAcceptPrivacy(!acceptPrivacy);
    if (field === "acceptMarketing") setAcceptMarketing(!acceptMarketing);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      router.push("/payment");
    }
  };

  // Validate Traveler 1 section (called on last field blur)
  const validateTraveler1 = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    const traveler = formState.travelers[0];
    if (!traveler) return false;

    if (!isValidName(traveler.name)) {
      newErrors.traveler1_name = "Name must be at least 2 characters";
      isValid = false;
    }
    if (!isValidName(traveler.firstName)) {
      newErrors.traveler1_firstName = "First name must be at least 2 characters";
      isValid = false;
    }
    if (!isValidDate(traveler.birthDate)) {
      newErrors.traveler1_birthDate = "Please enter a valid date (DD/MM/YYYY)";
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (isValid) {
      setTraveler1Validated(true);
    }
    return isValid;
  };

  // Validate Contact Info section (called on last field blur)
  const validateContactInfo = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    const { address, city, postcode, phoneNumber, email } = formState.policyholder;

    if (address.trim().length < 5) {
      newErrors.address = "Please enter a valid address";
      isValid = false;
    }
    if (city.trim().length < 2) {
      newErrors.city = "Please enter a valid city";
      isValid = false;
    }
    if (!isValidPostcode(postcode)) {
      newErrors.postcode = "Please enter a valid postcode";
      isValid = false;
    }
    if (!isValidPhone(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }
    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (isValid) {
      setContactInfoValidated(true);
      // Focus next traveler if there are additional travelers
      if (travelersCount > 1) {
        setTimeout(() => {
          scrollToElement(additionalTravelerRefs.current[0]);
          setTimeout(() => additionalTravelerNameRefs.current[0]?.focus({ preventScroll: true }), 100);
        }, 150);
      }
    }
    return isValid;
  };

  // Validate additional traveler section (called on last field blur)
  const validateAdditionalTraveler = (index: number): boolean => {
    const travelerIndex = index + 1;
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    const traveler = formState.travelers[travelerIndex];
    if (!traveler) return false;

    if (!isValidName(traveler.name)) {
      newErrors[`traveler${travelerIndex + 1}_name`] = "Name must be at least 2 characters";
      isValid = false;
    }
    if (!isValidName(traveler.firstName)) {
      newErrors[`traveler${travelerIndex + 1}_firstName`] = "First name must be at least 2 characters";
      isValid = false;
    }
    if (!isValidDate(traveler.birthDate)) {
      newErrors[`traveler${travelerIndex + 1}_birthDate`] = "Please enter a valid date (DD/MM/YYYY)";
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (isValid) {
      setAdditionalTravelersValidated((prev) => {
        const newArr = [...prev];
        newArr[index] = true;
        return newArr;
      });
      // Focus next traveler if there are more
      if (index + 2 < travelersCount) {
        setTimeout(() => {
          scrollToElement(additionalTravelerRefs.current[index + 1]);
          setTimeout(() => additionalTravelerNameRefs.current[index + 1]?.focus({ preventScroll: true }), 100);
        }, 150);
      }
    }
    return isValid;
  };

  // Handle Enter key to move to next field or validate section
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement | null>,
    onLastField?: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      } else if (onLastField) {
        onLastField();
        (e.target as HTMLInputElement).blur();
      }
    }
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

      {/* Content */}
      <div className="flex-1">
        {/* Title */}
        <div className="p-6">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D] text-center">
            {travelersCount === 1 ? "Traveler details" : "Travelers details"}
          </h1>
        </div>

        {/* Section 1: Is policyholder a traveler */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          <p className="text-base font-semibold leading-6 text-[#111B1D]">
            Is one of the travelers the policyholder?
          </p>
          <YesNoButtons
            value={formState.isPolicyholderTraveler}
            onChange={handlePolicyholderChange}
          />
        </div>

        {/* Section 2: Traveler 1 (Policyholder) */}
        {showSection2 && (
          <div ref={section2Ref} className="px-6 pb-6 scroll-mt-[120px]">
            {/* Header */}
            <div className="mb-4">
              <span className="text-xs text-[#1F1F9C]">Policyholder</span>
              <p className="text-base leading-6 text-[#111B1D] mt-1">
                <span className="font-bold">Traveler 1</span>
                <span className="font-normal"> - Adult</span>
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Name</label>
                <div className="relative">
                  <input
                    ref={traveler1NameRef}
                    type="text"
                    autoComplete="family-name"
                    enterKeyHint="next"
                    value={formState.travelers[0]?.name || ""}
                    onChange={(e) => handleTravelerChange(0, "name", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, traveler1FirstNameRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.traveler1_name
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.travelers[0]?.name && !errors.traveler1_name && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.traveler1_name && <p className="text-sm text-[#D24723]">{errors.traveler1_name}</p>}
              </div>

              {/* First name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">First name</label>
                <div className="relative">
                  <input
                    ref={traveler1FirstNameRef}
                    type="text"
                    autoComplete="given-name"
                    enterKeyHint="next"
                    value={formState.travelers[0]?.firstName || ""}
                    onChange={(e) => handleTravelerChange(0, "firstName", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, traveler1BirthDateRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.traveler1_firstName
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.travelers[0]?.firstName && !errors.traveler1_firstName && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.traveler1_firstName && <p className="text-sm text-[#D24723]">{errors.traveler1_firstName}</p>}
              </div>

              {/* Birth date - LAST FIELD, validates section on blur */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Birth date</label>
                <div className="relative">
                  <input
                    ref={traveler1BirthDateRef}
                    type="text"
                    inputMode="numeric"
                    enterKeyHint="next"
                    maxLength={10}
                    placeholder="DD/MM/YYYY"
                    value={formState.travelers[0]?.birthDate || ""}
                    onChange={(e) => handleTravelerChange(0, "birthDate", e.target.value)}
                    onBlur={validateTraveler1}
                    onKeyDown={(e) => handleKeyDown(e, undefined, validateTraveler1)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.traveler1_birthDate
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.travelers[0]?.birthDate && !errors.traveler1_birthDate && isValidDate(formState.travelers[0]?.birthDate) && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.traveler1_birthDate && <p className="text-sm text-[#D24723]">{errors.traveler1_birthDate}</p>}
              </div>
            </div>

            {/* Info tooltip */}
            <div className="mt-6">
              <InfoTooltip>
                Please note that the policyholder and the insured must be Spanish residents
                domiciled in Spain, and that the trip must originate from Spain.
              </InfoTooltip>
            </div>
          </div>
        )}

        {/* Section 3: Contact Info */}
        {showSection3 && (
          <div ref={section3Ref} className="px-6 pb-6 scroll-mt-[120px]">
            {/* Address */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Address</label>
                <div className="relative">
                  <input
                    ref={addressRef}
                    type="text"
                    autoComplete="street-address"
                    enterKeyHint="next"
                    value={formState.policyholder.address}
                    onChange={(e) => handlePolicyholderDataChange("address", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, cityRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.address
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.policyholder.address && !errors.address && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.address && <p className="text-sm text-[#D24723]">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">City</label>
                <div className="relative">
                  <input
                    ref={cityRef}
                    type="text"
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={formState.policyholder.city}
                    onChange={(e) => handlePolicyholderDataChange("city", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, postcodeRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.city
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.policyholder.city && !errors.city && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.city && <p className="text-sm text-[#D24723]">{errors.city}</p>}
              </div>

              {/* Postcode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Postcode</label>
                <div className="relative">
                  <input
                    ref={postcodeRef}
                    type="text"
                    autoComplete="postal-code"
                    enterKeyHint="next"
                    value={formState.policyholder.postcode}
                    onChange={(e) => handlePolicyholderDataChange("postcode", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.postcode
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.policyholder.postcode && !errors.postcode && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.postcode && <p className="text-sm text-[#D24723]">{errors.postcode}</p>}
              </div>
            </div>

            {/* Info tooltip */}
            <div className="mt-6 mb-6">
              <InfoTooltip>
                We only use your contact details to send you your policy documents and important
                information about your insurance.
              </InfoTooltip>
            </div>

            {/* Phone & Email */}
            <div className="flex flex-col gap-4">
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Phone number</label>
                <div className="relative">
                  <input
                    ref={phoneRef}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    placeholder="+33 09 89 87 76 98"
                    value={formState.policyholder.phoneNumber}
                    onChange={(e) => handlePolicyholderDataChange("phoneNumber", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, emailRef)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.phoneNumber
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.policyholder.phoneNumber && !errors.phoneNumber && isValidPhone(formState.policyholder.phoneNumber) && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.phoneNumber && <p className="text-sm text-[#D24723]">{errors.phoneNumber}</p>}
              </div>

              {/* Email - LAST FIELD, validates section on blur */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#343C3D]">Email</label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint={travelersCount > 1 ? "next" : "done"}
                    placeholder="email@example.com"
                    value={formState.policyholder.email}
                    onChange={(e) => handlePolicyholderDataChange("email", e.target.value)}
                    onBlur={validateContactInfo}
                    onKeyDown={(e) => handleKeyDown(e, undefined, validateContactInfo)}
                    className={cn(
                      "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                      errors.email
                        ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                        : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                    )}
                  />
                  {formState.policyholder.email && !errors.email && isValidEmail(formState.policyholder.email) && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                  )}
                </div>
                {errors.email && <p className="text-sm text-[#D24723]">{errors.email}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Additional Travelers (Traveler 2, 3, 4, etc.) */}
        {showSection3 &&
          contactInfoValidated &&
          formState.travelers.slice(1).map((traveler, idx) => {
            const travelerIndex = idx + 1;
            const travelerNumber = idx + 2;
            const isPreviousValidated = idx === 0 || additionalTravelersValidated[idx - 1];

            if (!isPreviousValidated) return null;

            return (
              <div
                key={travelerIndex}
                ref={(el) => {
                  additionalTravelerRefs.current[idx] = el;
                }}
                className="px-6 pb-6 scroll-mt-[120px]"
              >
                {/* Header */}
                <div className="mb-4">
                  <p className="text-base leading-6 text-[#111B1D]">
                    <span className="font-bold">Traveler {travelerNumber}</span>
                    <span className="font-normal"> - Adult</span>
                  </p>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#343C3D]">Name</label>
                    <div className="relative">
                      <input
                        ref={(el) => { additionalTravelerNameRefs.current[idx] = el; }}
                        type="text"
                        autoComplete="family-name"
                        enterKeyHint="next"
                        value={traveler.name}
                        onChange={(e) => handleTravelerChange(travelerIndex, "name", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            additionalTravelerFirstNameRefs.current[idx]?.focus();
                          }
                        }}
                        className={cn(
                          "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                          errors[`traveler${travelerNumber}_name`]
                            ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                            : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                        )}
                      />
                      {traveler.name && !errors[`traveler${travelerNumber}_name`] && (
                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                      )}
                    </div>
                    {errors[`traveler${travelerNumber}_name`] && (
                      <p className="text-sm text-[#D24723]">{errors[`traveler${travelerNumber}_name`]}</p>
                    )}
                  </div>

                  {/* First name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#343C3D]">First name</label>
                    <div className="relative">
                      <input
                        ref={(el) => { additionalTravelerFirstNameRefs.current[idx] = el; }}
                        type="text"
                        autoComplete="given-name"
                        enterKeyHint="next"
                        value={traveler.firstName}
                        onChange={(e) => handleTravelerChange(travelerIndex, "firstName", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            additionalTravelerBirthDateRefs.current[idx]?.focus();
                          }
                        }}
                        className={cn(
                          "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                          errors[`traveler${travelerNumber}_firstName`]
                            ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                            : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                        )}
                      />
                      {traveler.firstName && !errors[`traveler${travelerNumber}_firstName`] && (
                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                      )}
                    </div>
                    {errors[`traveler${travelerNumber}_firstName`] && (
                      <p className="text-sm text-[#D24723]">{errors[`traveler${travelerNumber}_firstName`]}</p>
                    )}
                  </div>

                  {/* Birth date - LAST FIELD */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#343C3D]">Birth date</label>
                    <div className="relative">
                      <input
                        ref={(el) => { additionalTravelerBirthDateRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        enterKeyHint={idx + 2 < travelersCount ? "next" : "done"}
                        maxLength={10}
                        placeholder="DD/MM/YYYY"
                        value={traveler.birthDate}
                        onChange={(e) => handleTravelerChange(travelerIndex, "birthDate", e.target.value)}
                        onBlur={() => validateAdditionalTraveler(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            validateAdditionalTraveler(idx);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className={cn(
                          "w-full h-12 px-4 pr-12 rounded-lg border bg-white text-base text-[#111B1D] outline-none transition-all placeholder:text-[#757575]",
                          errors[`traveler${travelerNumber}_birthDate`]
                            ? "border-[#D24723] focus:border-[#D24723] focus:shadow-[0px_0px_0px_3px_rgba(210,71,35,0.3)]"
                            : "border-[#757575] focus:border-[#1F1F9C] focus:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]"
                        )}
                      />
                      {traveler.birthDate && !errors[`traveler${travelerNumber}_birthDate`] && isValidDate(traveler.birthDate) && (
                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1F1F9C]" strokeWidth={2} />
                      )}
                    </div>
                    {errors[`traveler${travelerNumber}_birthDate`] && (
                      <p className="text-sm text-[#D24723]">{errors[`traveler${travelerNumber}_birthDate`]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Section: Legal info + Checkboxes */}
        {showLegalSection && (
          <div ref={legalSectionRef} className="px-6 pb-6 flex flex-col gap-6 scroll-mt-[120px]">
            <InfoTooltip>
              <strong>INTER PARTNER ASSISTANCE</strong> processes your personal data to handle your
              assistance request and fulfill your insurance contract. Data may also be used to
              improve services, manage claims, prevent fraud, or for statistical purposes. All
              requested information is required. For more details, please see our{" "}
              <a href="#" className="text-[#1F1F9C] underline">
                privacy policy
              </a>
              .
            </InfoTooltip>

            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={cn(
                    "mt-0.5 size-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                    formState.acceptTerms
                      ? "bg-[#00008F] border-[#00008F]"
                      : "border-[#757575] bg-white"
                  )}
                  onClick={() => handleCheckboxChange("acceptTerms")}
                >
                  {formState.acceptTerms && <Check className="size-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm leading-5 text-[#343C3D]">
                  By submitting my personal data, I confirm that I have read and accepted the{" "}
                  <a href="#" className="text-[#1F1F9C] underline">
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={cn(
                    "mt-0.5 size-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                    formState.acceptPrivacy
                      ? "bg-[#00008F] border-[#00008F]"
                      : "border-[#757575] bg-white"
                  )}
                  onClick={() => handleCheckboxChange("acceptPrivacy")}
                >
                  {formState.acceptPrivacy && (
                    <Check className="size-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-sm leading-5 text-[#343C3D]">
                  By the tick of this box, I certify that I have read, before subscribing to this
                  insurance, all the information contained in the{" "}
                  <a href="#" className="text-[#1F1F9C] underline">
                    Terms and Conditions
                  </a>{" "}
                  and in the{" "}
                  <a href="#" className="text-[#1F1F9C] underline">
                    Insurance Product Information Document
                  </a>
                  , which are provided in French language, and confirm that I fully understand the
                  terms and conditions of the insurance policy.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={cn(
                    "mt-0.5 size-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                    formState.acceptMarketing
                      ? "bg-[#00008F] border-[#00008F]"
                      : "border-[#757575] bg-white"
                  )}
                  onClick={() => handleCheckboxChange("acceptMarketing")}
                >
                  {formState.acceptMarketing && (
                    <Check className="size-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-sm leading-5 text-[#343C3D]">
                  I wish to receive commercial and marketing communications to know{" "}
                  <a href="#" className="text-[#1F1F9C] underline">
                    INTER PARTNER ASSISTANCE S.A.
                  </a>
                  , based on my profile.{" "}
                  <span className="text-[#757575]">(optional)</span>
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E5E5] px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[#757575]">Total</p>
            <p className="text-xl font-bold text-[#111B1D]">{formattedPrice}€</p>
          </div>
          <button
            type="button"
            onClick={() => setPriceBreakdownOpen(true)}
            className="text-sm text-[#1F1F9C] underline"
          >
            View price details
          </button>
        </div>
        <Button fullWidth disabled={!isFormValid} onClick={handleSubmit}>
          CONTINUE TO PAYMENT
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
        options={addOnsItems}
        taxes={taxes}
        totalPrice={totalPrice}
        travelersCount={travelersCount}
        onEditPlan={() => router.push("/plans")}
        onEditOptions={() => router.push("/addons")}
      />
    </div>
  );
}
