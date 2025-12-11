"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Card type detection
type CardType = "visa" | "mastercard" | "amex" | "discover" | null;

function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5)/.test(cleaned)) return "discover";
  return null;
}

// Card icon component
function CardIcon({ type }: { type: CardType }) {
  if (type === "mastercard") {
    return (
      <div className="h-6 w-[35px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 32 20" className="h-4 w-auto">
          <circle cx="11" cy="10" r="7" fill="#EB001B" />
          <circle cx="21" cy="10" r="7" fill="#F79E1B" />
          <path d="M16 4.5a7 7 0 0 0 0 11 7 7 0 0 0 0-11z" fill="#FF5F00" />
        </svg>
      </div>
    );
  }
  if (type === "visa") {
    return (
      <div className="h-6 w-[35px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 48 16" className="h-3 w-auto">
          <text x="0" y="13" fill="#1A1F71" fontFamily="Arial" fontWeight="bold" fontSize="14">VISA</text>
        </svg>
      </div>
    );
  }
  if (type === "amex") {
    return (
      <div className="h-6 w-[35px] rounded-md border border-[#D9D9D9] bg-[#1F72CD] flex items-center justify-center overflow-hidden">
        <span className="text-[8px] font-bold text-white">AMEX</span>
      </div>
    );
  }
  if (type === "discover") {
    return (
      <div className="h-6 w-[35px] rounded-md border border-[#D9D9D9] bg-white flex items-center justify-center overflow-hidden">
        <span className="text-[6px] font-bold text-[#FF6000]">DISCOVER</span>
      </div>
    );
  }
  return null;
}

type InstallmentOption = 3 | 6 | 9;

interface InstallmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  onPay: () => void;
}

export function InstallmentDrawer({
  isOpen,
  onClose,
  totalPrice,
  onPay,
}: InstallmentDrawerProps) {
  const [installments, setInstallments] = useState<InstallmentOption>(6);
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Calculate monthly payment
  const monthlyPayment = totalPrice / installments;
  const formattedMonthly = monthlyPayment.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };

  // Format expiry date
  const formatExpDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  // Detect card type
  const cardType = detectCardType(cardNumber);

  // Format total price
  const formattedPrice = totalPrice.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Validate form
  const isValid =
    cardNumber.replace(/\s/g, "").length >= 15 &&
    expDate.length === 5 &&
    cvc.length >= 3 &&
    cardName.length > 0 &&
    acceptTerms;

  const handleSubmit = () => {
    if (isValid) {
      onPay();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="bg-white rounded-t-2xl px-0 pt-0 pb-0 max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-2.5 pb-5">
          <div className="w-[93px] h-1.5 bg-[#D9D9D9] rounded-full" />
        </div>

        {/* Hidden title for accessibility */}
        <SheetTitle className="sr-only">Pay in Installments</SheetTitle>

        {/* Installment Tabs */}
        <div className="px-5 pb-5">
          <div className="flex gap-2.5">
            {([3, 6, 9] as InstallmentOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInstallments(option)}
                className={cn(
                  "flex-1 h-10 rounded-lg text-xs font-semibold uppercase tracking-[1px] transition-colors",
                  installments === option
                    ? "bg-[#00008F] text-white"
                    : "border border-[#1F1F9C] text-[#1F1F9C] hover:bg-[#00008F]/5"
                )}
              >
                Pay in {option}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="px-5 pb-5">
          <p className="text-base font-semibold leading-6 text-[#111B1D]">
            Pay in {installments} times by Credit Card
          </p>
          <p className="text-xs leading-4 text-[#111B1D]">
            Pay in {installments} monthly payments of €{formattedMonthly} on the 1st of each month.
          </p>
        </div>

        {/* Form */}
        <div className="px-5 flex flex-col gap-4">
          {/* Card Number */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold leading-6 text-[#343C3D]">
              Card number
            </label>
            <div className="flex h-[50px] border border-[#CCCCCC] rounded-lg overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
              {cardType && (
                <div className="flex items-center pl-2">
                  <CardIcon type={cardType} />
                </div>
              )}
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 1234 1234 1234"
                className="flex-1 px-4 text-base text-[#111B1D] bg-white outline-none placeholder:text-[#757575]"
              />
            </div>
          </div>

          {/* Exp/Date & CVC */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-base font-semibold leading-6 text-[#343C3D]">
                Exp/date
              </label>
              <div className="flex h-[50px] border border-[#CCCCCC] rounded-lg overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
                <input
                  type="text"
                  inputMode="numeric"
                  value={expDate}
                  onChange={(e) => setExpDate(formatExpDate(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full px-4 text-base text-[#111B1D] bg-white outline-none placeholder:text-[#757575]"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-base font-semibold leading-6 text-[#343C3D]">
                CVC
              </label>
              <div className="flex h-[50px] border border-[#CCCCCC] rounded-lg overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  className="w-full px-4 text-base text-[#111B1D] bg-white outline-none placeholder:text-[#757575]"
                />
              </div>
            </div>
          </div>

          {/* Name on Card */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold leading-6 text-[#343C3D]">
              Name on card
            </label>
            <div className="flex h-[50px] border border-[#CCCCCC] rounded-lg overflow-hidden transition-all focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]">
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 text-base text-[#111B1D] bg-white outline-none placeholder:text-[#757575]"
              />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="px-5 py-5">
          <label className="flex items-start gap-2 cursor-pointer">
            <div
              className={cn(
                "mt-1 size-4 rounded flex items-center justify-center flex-shrink-0 transition-colors border",
                acceptTerms
                  ? "bg-[#00008F] border-[#00008F]"
                  : "border-[#757575] bg-white"
              )}
              onClick={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && (
                <Check className="size-2.5 text-white" strokeWidth={3} />
              )}
            </div>
            <span className="text-base leading-6 text-[#343C3D]">
              I accept the Terms and Conditions of Sale and confirm that all
              information provided is accurate.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4">
          <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
            Pay {formattedPrice} €
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
