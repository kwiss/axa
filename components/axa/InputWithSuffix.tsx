"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputWithSuffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix: string;
  error?: string;
}

export const InputWithSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ label, suffix, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-xl font-bold leading-7 text-[#111B1D]"
          >
            {label}
          </label>
        )}
        <div className={cn(
          "flex h-12 border rounded-lg overflow-hidden transition-all",
          error ? "border-[#D24723]" : "border-[#757575]",
          "focus-within:border-[#1F1F9C] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]",
          className
        )}>
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 px-4 py-3 text-base leading-6 text-[#111B1D] bg-white outline-none",
              "placeholder:text-[#757575]",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            {...props}
          />
          <div className="px-4 flex items-center bg-[rgba(142,187,255,0.2)] border-l border-[#757575] group-focus-within:border-[#1F1F9C]">
            <span className="text-base leading-6 font-semibold text-[#1F1F9C]">{suffix}</span>
          </div>
        </div>
        {error && (
          <p className="text-sm text-[#D24723]">{error}</p>
        )}
      </div>
    );
  }
);

InputWithSuffix.displayName = "InputWithSuffix";

