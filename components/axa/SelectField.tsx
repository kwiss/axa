"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  placeholder = "Select an option",
  value,
  options = [],
  onChange,
  error,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-xl font-bold leading-7 text-[#111B1D]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full h-12 px-4 py-2 appearance-none bg-white rounded text-base",
            "border focus:outline-none focus:ring-2 focus:ring-[#00008F] focus:border-[#00008F]",
            error ? "border-[#D24723]" : "border-[#CCCCCC]",
            !value && "text-[#757575]"
          )}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-6 text-[#343C3D] pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-[#D24723]">{error}</p>
      )}
    </div>
  );
}

