"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveQuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function SaveQuoteDrawer({
  isOpen,
  onClose,
  className,
}: SaveQuoteDrawerProps) {
  const [phone, setPhone] = useState("+33");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving quote:", { phone, email });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(17,27,29,0.5)] z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50",
          className
        )}
      >
        {/* Header with close button */}
        <div className="flex justify-end px-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="size-5 text-[#343C3D]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h2 className="text-2xl font-bold leading-8 text-[#111B1D] text-center mb-8">
            Not ready yet
          </h2>

          {/* Description */}
          <p className="text-base leading-6 text-[#111B1D] mb-8">
            No problem! We'll save your quote so you can easily complete it later.
          </p>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="block text-base font-semibold leading-6 text-[#343C3D] mb-2">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33"
              className="w-full h-10 px-4 border border-[#CCCCCC] rounded-lg text-base text-[#111B1D] placeholder:text-[#757575] outline-none focus:border-[#00008F]"
            />
          </div>

          {/* Email Field */}
          <div className="mb-8">
            <label className="block text-base font-semibold leading-6 text-[#343C3D] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g mike.horn@gmail.com"
              className="w-full h-10 px-4 border border-[#CCCCCC] rounded-lg text-base text-[#111B1D] placeholder:text-[#757575] outline-none focus:border-[#00008F]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 px-6 border border-[#1F1F9C] rounded text-sm font-semibold uppercase tracking-[1px] text-[#343C3D] hover:bg-[#F0F0F0] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 h-12 px-6 bg-[#00008F] rounded-lg text-sm font-semibold uppercase tracking-[1px] text-white hover:bg-[#1F1F9C] transition-colors"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
