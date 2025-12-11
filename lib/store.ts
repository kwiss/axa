import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type TripType = "solo" | "partner" | "family" | "abroad" | "student";
export type InsuranceType = "single" | "multi";
export type PlanId = "basic" | "essential" | "premium";
export type AddOnType = "sport" | "luggages" | "cancel-any-reason" | "missed-connection" | "electronics";

export interface Traveler {
  age: number | null;
  name?: string;
  firstName?: string;
  birthDate?: string;
}

export interface PolicyholderData {
  address: string;
  city: string;
  postcode: string;
  phoneNumber: string;
  email: string;
}

export interface FunnelState {
  // Step 1: Home
  tripType: TripType | null;

  // Step 2: Form
  insuranceType: InsuranceType | null;
  needsCancellation: boolean | null;
  tripCost: number | null;
  destination: string | null;
  dates: { start: string; end: string } | null;
  travelers: Traveler[];
  hasPromoCode: boolean | null;
  promoCode: string;

  // Step 3: Plans
  selectedPlanId: PlanId;

  // Step 4: Add-ons
  selectedAddOns: AddOnType[];

  // Step 5: Checkout
  isPolicyholderTraveler: boolean | null;
  policyholder: PolicyholderData;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

interface FunnelActions {
  // Home actions
  setTripType: (tripType: TripType | null) => void;

  // Form actions
  setInsuranceType: (type: InsuranceType | null) => void;
  setNeedsCancellation: (value: boolean | null) => void;
  setTripCost: (cost: number | null) => void;
  setDestination: (destination: string | null) => void;
  setDates: (dates: { start: string; end: string } | null) => void;
  setTravelers: (travelers: Traveler[]) => void;
  updateTraveler: (index: number, data: Partial<Traveler>) => void;
  addTraveler: () => void;
  setHasPromoCode: (value: boolean | null) => void;
  setPromoCode: (value: string) => void;

  // Plans actions
  setSelectedPlanId: (planId: PlanId) => void;

  // Add-ons actions
  addAddOn: (type: AddOnType) => void;
  removeAddOn: (type: AddOnType) => void;
  setSelectedAddOns: (addOns: AddOnType[]) => void;

  // Checkout actions
  setIsPolicyholderTraveler: (value: boolean | null) => void;
  setPolicyholder: (data: Partial<PolicyholderData>) => void;
  setAcceptTerms: (value: boolean) => void;
  setAcceptPrivacy: (value: boolean) => void;
  setAcceptMarketing: (value: boolean) => void;

  // Reset
  reset: () => void;
  resetCheckout: () => void;
}

const initialState: FunnelState = {
  // Home
  tripType: null,

  // Form
  insuranceType: null,
  needsCancellation: null,
  tripCost: null,
  destination: null,
  dates: null,
  travelers: [{ age: null }],
  hasPromoCode: null,
  promoCode: "",

  // Plans
  selectedPlanId: "essential",

  // Add-ons
  selectedAddOns: [],

  // Checkout
  isPolicyholderTraveler: null,
  policyholder: {
    address: "",
    city: "",
    postcode: "",
    phoneNumber: "",
    email: "",
  },
  acceptTerms: false,
  acceptPrivacy: false,
  acceptMarketing: false,
};

export const useFunnelStore = create<FunnelState & FunnelActions>()(
  persist(
    (set) => ({
      ...initialState,

      // Home actions
      setTripType: (tripType) => set({ tripType }),

      // Form actions
      setInsuranceType: (insuranceType) => set({ insuranceType }),
      setNeedsCancellation: (needsCancellation) =>
        set((state) => ({
          needsCancellation,
          tripCost: needsCancellation ? state.tripCost : null,
        })),
      setTripCost: (tripCost) => set({ tripCost }),
      setDestination: (destination) => set({ destination }),
      setDates: (dates) => set({ dates }),
      setTravelers: (travelers) => set({ travelers }),
      updateTraveler: (index, data) =>
        set((state) => {
          const newTravelers = [...state.travelers];
          newTravelers[index] = { ...newTravelers[index], ...data };
          return { travelers: newTravelers };
        }),
      addTraveler: () =>
        set((state) => ({
          travelers: [...state.travelers, { age: null }],
        })),
      setHasPromoCode: (hasPromoCode) => set({ hasPromoCode }),
      setPromoCode: (promoCode) => set({ promoCode }),

      // Plans actions
      setSelectedPlanId: (selectedPlanId) => set({ selectedPlanId }),

      // Add-ons actions
      addAddOn: (type) =>
        set((state) => ({
          selectedAddOns: state.selectedAddOns.includes(type)
            ? state.selectedAddOns
            : [...state.selectedAddOns, type],
        })),
      removeAddOn: (type) =>
        set((state) => ({
          selectedAddOns: state.selectedAddOns.filter((t) => t !== type),
        })),
      setSelectedAddOns: (selectedAddOns) => set({ selectedAddOns }),

      // Checkout actions
      setIsPolicyholderTraveler: (isPolicyholderTraveler) =>
        set({ isPolicyholderTraveler }),
      setPolicyholder: (data) =>
        set((state) => ({
          policyholder: { ...state.policyholder, ...data },
        })),
      setAcceptTerms: (acceptTerms) => set({ acceptTerms }),
      setAcceptPrivacy: (acceptPrivacy) => set({ acceptPrivacy }),
      setAcceptMarketing: (acceptMarketing) => set({ acceptMarketing }),

      // Reset
      reset: () => set(initialState),
      resetCheckout: () =>
        set({
          isPolicyholderTraveler: null,
          policyholder: {
            address: "",
            city: "",
            postcode: "",
            phoneNumber: "",
            email: "",
          },
          acceptTerms: false,
          acceptPrivacy: false,
          acceptMarketing: false,
        }),
    }),
    {
      name: "axa-funnel-storage",
    }
  )
);

// Computed values / selectors
export const useTravelersCount = () =>
  useFunnelStore((state) => state.travelers.length);

export const useTripSummary = () =>
  useFunnelStore((state) => ({
    destination: state.destination,
    startDate: state.dates?.start,
    endDate: state.dates?.end,
    travelers: state.travelers.length,
  }));
